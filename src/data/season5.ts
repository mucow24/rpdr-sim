import type { SeasonData } from '../engine/types';

// Skill ratings are 1-10, based on actual Season 5 performance.
// These are subjective but calibrated to produce realistic simulations.
const season5: SeasonData = {
  id: 'season5',
  name: 'Season 5',
  queens: [
    {
      id: 'jinkx',
      name: 'Jinkx Monsoon',
      skills: { comedy: 10, design: 5, acting: 9, dance: 5, snatchGame: 10, improv: 9, runway: 5, singing: 8 },
      lipSync: 6,
      color: '#e74c3c',
    },
    {
      id: 'alaska',
      name: 'Alaska',
      skills: { comedy: 9, design: 7, acting: 8, dance: 6, snatchGame: 8, improv: 8, runway: 8, singing: 7 },
      lipSync: 7,
      color: '#3498db',
    },
    {
      id: 'roxxxy',
      name: 'Roxxxy Andrews',
      skills: { comedy: 4, design: 10, acting: 5, dance: 7, snatchGame: 3, improv: 4, runway: 10, singing: 4 },
      lipSync: 8,
      color: '#f39c12',
    },
    {
      id: 'detox',
      name: 'Detox',
      skills: { comedy: 6, design: 8, acting: 7, dance: 7, snatchGame: 6, improv: 6, runway: 9, singing: 5 },
      lipSync: 7,
      color: '#2ecc71',
    },
    {
      id: 'coco',
      name: 'Coco Montrese',
      skills: { comedy: 5, design: 5, acting: 5, dance: 7, snatchGame: 4, improv: 5, runway: 6, singing: 6 },
      lipSync: 10,
      color: '#9b59b6',
    },
    {
      id: 'alyssa',
      name: 'Alyssa Edwards',
      skills: { comedy: 6, design: 5, acting: 5, dance: 10, snatchGame: 3, improv: 5, runway: 7, singing: 4 },
      lipSync: 9,
      color: '#e91e90',
    },
    {
      id: 'ivy',
      name: 'Ivy Winters',
      skills: { comedy: 5, design: 9, acting: 5, dance: 6, snatchGame: 4, improv: 4, runway: 8, singing: 7 },
      lipSync: 5,
      color: '#1abc9c',
    },
    {
      id: 'jade',
      name: 'Jade Jolie',
      skills: { comedy: 5, design: 6, acting: 4, dance: 5, snatchGame: 4, improv: 4, runway: 6, singing: 5 },
      lipSync: 6,
      color: '#f1c40f',
    },
    {
      id: 'lineysha',
      name: 'Lineysha Sparx',
      skills: { comedy: 3, design: 9, acting: 4, dance: 6, snatchGame: 3, improv: 3, runway: 9, singing: 3 },
      lipSync: 6,
      color: '#e67e22',
    },
    {
      id: 'vivienne',
      name: 'Vivienne Pinay',
      skills: { comedy: 3, design: 6, acting: 3, dance: 5, snatchGame: 3, improv: 3, runway: 7, singing: 3 },
      lipSync: 4,
      color: '#c0392b',
    },
    {
      id: 'honey',
      name: 'Honey Mahogany',
      skills: { comedy: 4, design: 5, acting: 4, dance: 4, snatchGame: 3, improv: 4, runway: 5, singing: 6 },
      lipSync: 4,
      color: '#d4a574',
    },
    {
      id: 'monica',
      name: 'Monica Beverly Hillz',
      skills: { comedy: 4, design: 4, acting: 4, dance: 5, snatchGame: 3, improv: 4, runway: 5, singing: 5 },
      lipSync: 5,
      color: '#8e44ad',
    },
    {
      id: 'serena',
      name: 'Serena ChaCha',
      skills: { comedy: 3, design: 4, acting: 3, dance: 5, snatchGame: 2, improv: 3, runway: 4, singing: 3 },
      lipSync: 4,
      color: '#16a085',
    },
    {
      id: 'penny',
      name: 'Penny Tration',
      skills: { comedy: 4, design: 4, acting: 4, dance: 4, snatchGame: 3, improv: 4, runway: 4, singing: 4 },
      lipSync: 3,
      color: '#7f8c8d',
    },
  ],
  episodes: [
    // Ep 1: "RuPaullywood or Bust" (singing/performance)
    {
      number: 1,
      challengeType: 'singing',
      challengeName: 'RuPaul Roast... I mean, Lip Sync Extravaganza',
      placements: {
        roxxxy: 'WIN',
        alaska: 'HIGH', ivy: 'HIGH', lineysha: 'HIGH',
        jinkx: 'SAFE', detox: 'SAFE', coco: 'SAFE', alyssa: 'SAFE',
        jade: 'SAFE', honey: 'SAFE', monica: 'SAFE', vivienne: 'SAFE',
        penny: 'BTM2', serena: 'BTM2',
      },
      eliminated: ['penny'],
    },
    // Ep 2: "Lip Synch Extravaganza Eleganza" (design/unconventional)
    {
      number: 2,
      challengeType: 'design',
      challengeName: 'Unconventional Materials',
      placements: {
        lineysha: 'WIN',
        roxxxy: 'HIGH', ivy: 'HIGH',
        alaska: 'SAFE', jinkx: 'SAFE', detox: 'SAFE', coco: 'SAFE',
        alyssa: 'SAFE', jade: 'SAFE', honey: 'SAFE', vivienne: 'SAFE',
        monica: 'BTM2', serena: 'BTM2',
      },
      eliminated: ['serena'],
    },
    // Ep 3: "Draggle Rock" (dance/performance)
    {
      number: 3,
      challengeType: 'dance',
      challengeName: 'Draggle Rock',
      placements: {
        detox: 'WIN',
        jinkx: 'HIGH', roxxxy: 'HIGH',
        alaska: 'SAFE', ivy: 'SAFE', lineysha: 'SAFE',
        alyssa: 'SAFE', jade: 'SAFE', vivienne: 'SAFE',
        honey: 'LOW',
        coco: 'BTM2', monica: 'BTM2',
      },
      eliminated: ['monica'],
    },
    // Ep 4: "Black Swan: Why It Gotta Be Black?" (acting) — DOUBLE ELIMINATION
    {
      number: 4,
      challengeType: 'acting',
      challengeName: 'Black Swan: Why It Gotta Be Black?',
      placements: {
        alyssa: 'WIN',
        ivy: 'HIGH', jinkx: 'HIGH',
        roxxxy: 'SAFE', alaska: 'SAFE', detox: 'SAFE',
        coco: 'LOW', lineysha: 'LOW', jade: 'LOW',
        honey: 'BTM2', vivienne: 'BTM2',
      },
      eliminated: ['honey', 'vivienne'],
    },
    // Ep 5: "Snatch Game" (snatchGame)
    {
      number: 5,
      challengeType: 'improv',
      challengeName: 'Telenovela Acting Challenge',
      placements: {
        jinkx: 'WIN',
        alaska: 'HIGH', roxxxy: 'HIGH',
        ivy: 'SAFE', coco: 'SAFE', alyssa: 'SAFE',
        jade: 'LOW',
        detox: 'BTM2', lineysha: 'BTM2',
      },
      eliminated: ['lineysha'],
    },
    // Ep 6: "Can I Get an Amen?" (singing/comedy)
    {
      number: 6,
      challengeType: 'comedy',
      challengeName: 'Can I Get an Amen?',
      placements: {
        ivy: 'WIN',
        jinkx: 'HIGH', roxxxy: 'HIGH',
        alaska: 'SAFE', alyssa: 'SAFE', detox: 'SAFE',
        coco: 'BTM2', jade: 'BTM2',
      },
      eliminated: ['jade'],
    },
    // Ep 7: "RuPaul Roast" (comedy) — NON-ELIMINATION
    {
      number: 7,
      challengeType: 'snatchGame',
      challengeName: 'Snatch Game',
      placements: {
        coco: 'WIN',
        alaska: 'HIGH', jinkx: 'HIGH',
        ivy: 'SAFE', detox: 'SAFE',
        alyssa: 'BTM2', roxxxy: 'BTM2',
      },
      eliminated: [],
    },
    // Ep 8: "Scent of a Drag Queen" (comedy/acting)
    {
      number: 8,
      challengeType: 'comedy',
      challengeName: 'Scent of a Drag Queen',
      placements: {
        alaska: 'WIN',
        detox: 'HIGH', jinkx: 'HIGH',
        roxxxy: 'SAFE', coco: 'SAFE',
        alyssa: 'BTM2', ivy: 'BTM2',
      },
      eliminated: ['ivy'],
    },
    // Ep 9: "Drama Queens" (acting)
    {
      number: 9,
      challengeType: 'acting',
      challengeName: 'Drama Queens',
      placements: {
        jinkx: 'WIN',
        alaska: 'HIGH', roxxxy: 'HIGH',
        detox: 'SAFE',
        alyssa: 'BTM2', coco: 'BTM2',
      },
      eliminated: ['alyssa'],
    },
    // Ep 10: "Super Troopers" (design)
    {
      number: 10,
      challengeType: 'design',
      challengeName: 'Super Troopers',
      placements: {
        roxxxy: 'WIN',
        jinkx: 'HIGH',
        alaska: 'SAFE',
        coco: 'BTM2', detox: 'BTM2',
      },
      eliminated: ['coco'],
    },
    // Ep 11: "Sugar Ball" (design)
    {
      number: 11,
      challengeType: 'comedy',
      challengeName: 'Sugar Ball',
      placements: {
        alaska: 'WIN',
        roxxxy: 'HIGH',
        detox: 'BTM2', jinkx: 'BTM2',
      },
      eliminated: ['detox'],
    },
    // Finale
    {
      kind: 'finale',
      finaleType: 'default',
      number: 12,
      challengeName: 'Grand Finale',
      placements: {},
      eliminated: [],
    },
  ],
};

export default season5;
