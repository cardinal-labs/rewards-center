/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'
export type UpdateReceiptManagerIx = {
  authority: web3.PublicKey
  requiredStakeSeconds: beet.bignum
  stakeSecondsToUse: beet.bignum
  paymentMint: web3.PublicKey
  paymentAmount: beet.bignum
  paymentManager: web3.PublicKey
  paymentRecipient: web3.PublicKey
  requiresAuthorization: boolean
  paymentInfo: web3.PublicKey
  claimActionPaymentInfo: web3.PublicKey
  maxClaimedReceipts: beet.COption<beet.bignum>
}

/**
 * @category userTypes
 * @category generated
 */
export const updateReceiptManagerIxBeet =
  new beet.FixableBeetArgsStruct<UpdateReceiptManagerIx>(
    [
      ['authority', beetSolana.publicKey],
      ['requiredStakeSeconds', beet.u128],
      ['stakeSecondsToUse', beet.u128],
      ['paymentMint', beetSolana.publicKey],
      ['paymentAmount', beet.u64],
      ['paymentManager', beetSolana.publicKey],
      ['paymentRecipient', beetSolana.publicKey],
      ['requiresAuthorization', beet.bool],
      ['paymentInfo', beetSolana.publicKey],
      ['claimActionPaymentInfo', beetSolana.publicKey],
      ['maxClaimedReceipts', beet.coption(beet.u128)],
    ],
    'UpdateReceiptManagerIx'
  )
