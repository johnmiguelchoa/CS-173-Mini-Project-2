# Escrow - Example for illustrative purposes only.

# BLAKE2b-256 Hash generator
# https://toolkitbay.com/tkb/tool/BLAKE2b_256

# Hex to ASCII converter
# https://onlinehextools.com/convert-hex-to-ascii

# Note: With regard to the conflict between the specs and the provided contract, I prioritized the provided contract.

# Milestone 4 Notes
# - Admin revert funds if both parties accept to withdraw the escrow
# - My implementation involves the following:
    # - New entry point for owner and counterparty to request withdrawal
    # - New entry point for owner and counterparty to retract their withdrawal
    # - New entry point for admin to authorize withdrawal and revert funds

import smartpy as sp

class Escrow(sp.Contract):
    def __init__(self, admin, owner, fromOwner, counterparty, fromCounterparty, epoch, hashedSecret):
        self.init(
            fromOwner           = fromOwner,
            fromCounterparty    = fromCounterparty,
            balanceOwner        = sp.tez(0),
            balanceCounterparty = sp.tez(0),
            hashedSecret        = hashedSecret,
            epoch               = epoch, # Note that initialized UTC time must be in UTC+0 (GMT+0)
            owner               = owner,
            counterparty        = counterparty,
            admin               = admin,
            withdrawOwner       = False,
            withdrawCounterparty = False,
        )

    @sp.entry_point
    def addBalanceOwner(self):
        # Add specific amount to owner's balance if balance is 0
        sp.verify(self.data.balanceOwner == sp.tez(0))
        sp.verify(sp.amount == self.data.fromOwner)
        self.data.balanceOwner = self.data.fromOwner

    @sp.entry_point
    def addBalanceCounterparty(self):
        # Add specific amount to owner's balance if balance is 0
        sp.verify(self.data.balanceCounterparty == sp.tez(0))
        sp.verify(sp.amount == self.data.fromCounterparty)
        self.data.balanceCounterparty = self.data.fromCounterparty

    def claim(self, identity):
        # Claimant must be the sender
        sp.verify(sp.sender == identity)

        # claimant claims balance of both owner and counterparty
        sp.send(identity, self.data.balanceOwner + self.data.balanceCounterparty)
        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)

    @sp.entry_point
    def claimCounterparty(self, params):
        # Counterparty can only claim before epoch and with correct hashed secret
        sp.verify(sp.now < self.data.epoch)
        sp.verify(self.data.hashedSecret == sp.blake2b(params.secret))
        self.claim(self.data.counterparty)

    @sp.entry_point
    def claimOwner(self):
        # Owner can only claim after the epoch
        sp.verify(self.data.epoch < sp.now)
        self.claim(self.data.owner)

    @sp.entry_point
    def requestWithdrawal(self):
        sp.if sp.sender == self.data.owner:
            sp.verify(self.data.withdrawOwner == False, "Owner has already requested for withdrawal.")
            self.data.withdrawOwner = True
        sp.else:
            sp.if sp.sender == self.data.counterparty:
                sp.verify(self.data.withdrawCounterparty == False, "Counterparty has already requested for withdrawal.")
                self.data.withdrawCounterparty = True
            sp.else:
                # Only owner and counterparty can request for withdrawal
                sp.failwith("Sender is neither the owner nor the counterparty.")
        

    @sp.entry_point
    def retractWithdrawal(self):
        # Only owner and counterparty can retract their withdrawal

        sp.if sp.sender == self.data.owner:
            sp.verify(self.data.withdrawOwner == True, "Owner has no active request for withdrawal.")
            self.data.withdrawOwner = False
        sp.else:
            sp.if sp.sender == self.data.counterparty:
                sp.verify(self.data.withdrawCounterparty == True, "Counterparty has no active request for withdrawal.")
                self.data.withdrawCounterparty = False
            sp.else:
                # Only owner and counterparty can retract their withdrawal
                sp.failwith("Sender is neither the owner nor the counterparty.")

    @sp.entry_point
    def authorizeWithdrawal(self):
        sp.verify(sp.sender == self.data.admin, "NOT AUTHORIZED")
        sp.verify(self.data.withdrawOwner == True, "Owner has no active request for withdrawal.")
        sp.verify(self.data.withdrawCounterparty == True, "Counterparty has no active request for withdrawal.")

        # Revert funds by returning balance to respective parties
        sp.send(self.data.owner, self.data.balanceOwner)
        sp.send(self.data.counterparty, self.data.balanceCounterparty)
        self.data.balanceOwner = sp.tez(0)
        self.data.balanceCounterparty = sp.tez(0)

        # Reset withdraw statuses to False
        self.data.withdrawOwner = False
        self.data.withdrawCounterparty = False

@sp.add_test(name = "Escrow")
def test():
    scenario = sp.test_scenario()
    scenario.h1("Escrow")
    hashSecret = sp.blake2b(sp.bytes("0x01223344"))
    alice = sp.test_account("Alice")
    bob = sp.test_account("Bob")
    admin = sp.test_account("admin")

    c1 = Escrow(admin.address, alice.address, sp.tez(50), bob.address, sp.tez(4), sp.timestamp(123), hashSecret)
    scenario += c1
    
    c1.addBalanceOwner().run(sender = alice, amount = sp.tez(50))
    c1.addBalanceCounterparty().run(sender = bob, amount = sp.tez(4))
    
    scenario.h3("Erronous secret")
    c1.claimCounterparty(secret = sp.bytes("0x01223343")).run(sender = bob, valid = False)
    
    scenario.h3("Correct secret")
    c1.claimCounterparty(secret = sp.bytes("0x01223344")).run(sender = bob)

    scenario.h2("Non-admin tries to authorize withdrawal")
    c1.requestWithdrawal().run(sender = alice)
    c1.authorizeWithdrawal().run(sender = alice, valid = False)

    scenario.h2("Withdrawal retracted before authorization")
    c1.requestWithdrawal().run(sender = bob)
    c1.retractWithdrawal().run(sender = bob)
    c1.authorizeWithdrawal().run(sender = admin, valid = False)

    scenario.h2("Successful withdrawal")
    c1.requestWithdrawal().run(sender = bob)
    c1.authorizeWithdrawal().run(sender = admin)

sp.add_compilation_target("escrow", Escrow(sp.address("tz1ehP5FwryxwMFi9nGmqMbPjr9FsHr8LEFM"), sp.address("tz1UTutNsFkyypTyP4eD687wravHp4ARYUV8"), sp.tez(60), sp.address("tz1ZMh1YTV5Jfd7GHhP6moJWGhR6heWZ5pEy"), sp.tez(5), sp.timestamp(123), sp.bytes("0xeafc30f3d1bab60a6982151f6bfdc8a05469c8d328360024348562a6cd640732")))
