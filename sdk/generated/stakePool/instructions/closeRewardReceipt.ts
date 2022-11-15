/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category CloseRewardReceipt
 * @category generated
 */
export const closeRewardReceiptStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'CloseRewardReceiptInstructionArgs'
)
/**
 * Accounts required by the _closeRewardReceipt_ instruction
 *
 * @property [_writable_] rewardReceipt
 * @property [] receiptManager
 * @property [_writable_, **signer**] authority
 * @category Instructions
 * @category CloseRewardReceipt
 * @category generated
 */
export type CloseRewardReceiptInstructionAccounts = {
  rewardReceipt: web3.PublicKey
  receiptManager: web3.PublicKey
  authority: web3.PublicKey
}

export const closeRewardReceiptInstructionDiscriminator = [
  32, 71, 112, 123, 26, 145, 174, 48,
]

/**
 * Creates a _CloseRewardReceipt_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category CloseRewardReceipt
 * @category generated
 */
export function createCloseRewardReceiptInstruction(
  accounts: CloseRewardReceiptInstructionAccounts,
  programId = new web3.PublicKey('stk2688WVNGaHZGiLuuyGdQQWDdt8n69gEEo5eWYFt6')
) {
  const [data] = closeRewardReceiptStruct.serialize({
    instructionDiscriminator: closeRewardReceiptInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.rewardReceipt,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.receiptManager,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
  ]

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
