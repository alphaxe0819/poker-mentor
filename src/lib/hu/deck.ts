// src/lib/hu/deck.ts
import type { Card, Deck } from './types'
import { RANKS, SUITS } from './cards'

export function newDeck(): Deck {
  const deck: Deck = []
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      deck.push({ rank, suit })
    }
  }
  return deck
}

/** Fisher-Yates shuffle, returns a NEW array (input unchanged) */
export function shuffleDeck(deck: Deck): Deck {
  const copy = [...deck]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Removes and returns the top card. Mutates the deck. */
export function dealCard(deck: Deck): Card {
  const card = deck.pop()
  if (!card) throw new Error('Deck is empty')
  return card
}

/** Deal N cards from top of deck. Mutates the deck. */
export function dealCards(deck: Deck, n: number): Card[] {
  const cards: Card[] = []
  for (let i = 0; i < n; i++) {
    cards.push(dealCard(deck))
  }
  return cards
}
