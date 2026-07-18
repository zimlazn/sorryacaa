/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TebusanOption {
  TRAKTIR = 'TRAKTIR',
  PERMINTAAN_BEBAS = 'PERMINTAAN_BEBAS',
  SEHARIAN_FULL = 'SEHARIAN_FULL'
}

export interface TebusanData {
  id: string;
  option: TebusanOption;
  selectedAt: string;
  customNote?: string;
  isRedeemed: boolean;
}

export interface AcaaVoiceInput {
  name: string; // "Acaa"
  message: string;
  mood: string; // e.g., "Kecewa", "Marah", "Agak Melunak", "Sayang"
}

export interface GeminiApologyResponse {
  poem: string;
  letter: string;
  sweetMessage: string;
}

export interface ApologyState {
  hasChosen: boolean;
  chosenOption?: TebusanOption;
  customNote?: string;
  messageLog?: {
    id: string;
    message: string;
    reply: string;
    createdAt: string;
  }[];
}
