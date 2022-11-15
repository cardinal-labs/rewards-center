/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'
export type InitReceiptManagerIx = {
  name: string
  authority: web3.PublicKey
  requiredStakeSeconds: beet.bignum
  stakeSecondsToUse: beet.bignum
  paymentMint: web3.PublicKey
  paymentManager: web3.PublicKey
  paymentRecipient: web3.PublicKey
  requiresAuthorization: boolean
  maxClaimedReceipts: beet.COption<beet.bignum>
}

/**
 * @category userTypes
 * @category generated
 */
export const initReceiptManagerIxBeet =
  new beet.FixableBeetArgsStruct<InitReceiptManagerIx>(
    [
      ['name', beet.utf8String],
      ['authority', beetSolana.publicKey],
      ['requiredStakeSeconds', beet.u128],
      ['stakeSecondsToUse', beet.u128],
      ['paymentMint', beetSolana.publicKey],
      ['paymentManager', beetSolana.publicKey],
      ['paymentRecipient', beetSolana.publicKey],
      ['requiresAuthorization', beet.bool],
      ['maxClaimedReceipts', beet.coption(beet.u128)],
    ],
    'InitReceiptManagerIx'
  )
