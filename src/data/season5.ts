import type { SeasonData } from '../engine/types';

// V2 schema: 8 base stats (charisma added, singing→music, snatchGame dropped as a stat).
// Episodes tagged with an archetype; composite weights resolved via ARCHETYPES at scoring time.
const season5: SeasonData = {
  id: 'season5',
  name: 'Season 5',
  queens: [
    {
      id: 'jinkx',
      name: 'Jinkx Monsoon',
      skills: { comedy: 10, improv: 9, acting: 9, dance: 5, music: 8, design: 5, runway: 5, charisma: 9 },
      lipSync: 6,
      color: '#e74c3c',
    },
    {
      id: 'alaska',
      name: 'Alaska',
      skills: { comedy: 9, improv: 8, acting: 8, dance: 6, music: 7, design: 7, runway: 8, charisma: 8 },
      lipSync: 7,
      color: '#3498db',
    },
    {
      id: 'roxxxy',
      name: 'Roxxxy Andrews',
      skills: { comedy: 4, improv: 4, acting: 5, dance: 7, music: 4, design: 10, runway: 10, charisma: 4 },
      lipSync: 8,
      color: '#f39c12',
    },
    {
      id: 'detox',
      name: 'Detox',
      skills: { comedy: 6, improv: 6, acting: 7, dance: 7, music: 5, design: 8, runway: 9, charisma: 7 },
      lipSync: 7,
      color: '#2ecc71',
    },
    {
      id: 'coco',
      name: 'Coco Montrese',
      skills: { comedy: 5, improv: 5, acting: 5, dance: 7, music: 6, design: 5, runway: 6, charisma: 5 },
      lipSync: 10,
      color: '#9b59b6',
    },
    {
      id: 'alyssa',
      name: 'Alyssa Edwards',
      skills: { comedy: 6, improv: 5, acting: 5, dance: 10, music: 4, design: 5, runway: 7, charisma: 9 },
      lipSync: 9,
      color: '#e91e90',
    },
    {
      id: 'ivy',
      name: 'Ivy Winters',
      skills: { comedy: 5, improv: 4, acting: 5, dance: 6, music: 7, design: 9, runway: 8, charisma: 5 },
      lipSync: 5,
      color: '#1abc9c',
    },
    {
      id: 'jade',
      name: 'Jade Jolie',
      skills: { comedy: 5, improv: 4, acting: 4, dance: 5, music: 5, design: 6, runway: 6, charisma: 4 },
      lipSync: 6,
      color: '#f1c40f',
    },
    {
      id: 'lineysha',
      name: 'Lineysha Sparx',
      skills: { comedy: 3, improv: 3, acting: 4, dance: 6, music: 3, design: 9, runway: 9, charisma: 4 },
      lipSync: 6,
      color: '#e67e22',
    },
    {
      id: 'vivienne',
      name: 'Vivienne Pinay',
      skills: { comedy: 3, improv: 3, acting: 3, dance: 5, music: 3, design: 6, runway: 7, charisma: 3 },
      lipSync: 4,
      color: '#c0392b',
    },
    {
      id: 'honey',
      name: 'Honey Mahogany',
      skills: { comedy: 4, improv: 4, acting: 4, dance: 4, music: 6, design: 5, runway: 5, charisma: 4 },
      lipSync: 4,
      color: '#d4a574',
    },
    {
      id: 'monica',
      name: 'Monica Beverly Hillz',
      skills: { comedy: 4, improv: 4, acting: 4, dance: 5, music: 5, design: 4, runway: 5, charisma: 5 },
      lipSync: 5,
      color: '#8e44ad',
    },
    {
      id: 'serena',
      name: 'Serena ChaCha',
      skills: { comedy: 3, improv: 3, acting: 3, dance: 5, music: 3, design: 4, runway: 4, charisma: 3 },
      lipSync: 4,
      color: '#16a085',
    },
    {
      id: 'penny',
      name: 'Penny Tration',
      skills: { comedy: 4, improv: 4, acting: 4, dance: 4, music: 4, design: 4, runway: 4, charisma: 4 },
      lipSync: 3,
      color: '#7f8c8d',
    },
  ],
  episodes: [
    // Ep 1: "RuPaullywood or Bust" — Hollywood looks from car-wash materials
    {
      number: 1,
      archetype: 'unconventional',
      challengeName: 'RuPaullywood or Bust',
      placements: {
        roxxxy: 'WIN',
        alaska: 'HIGH', ivy: 'HIGH', lineysha: 'HIGH',
        jinkx: 'SAFE', detox: 'SAFE', coco: 'SAFE', alyssa: 'SAFE',
        jade: 'SAFE', honey: 'SAFE', monica: 'SAFE', vivienne: 'SAFE',
        penny: 'BTM2', serena: 'BTM2',
      },
      eliminated: ['penny'],
    },
    // Ep 2: "Lip Synch Extravaganza Eleganza" — team lip-sync to "Glamazon"
    {
      number: 2,
      archetype: 'girlGroup',
      challengeName: 'Lip Synch Extravaganza Eleganza',
      placements: {
        lineysha: 'WIN',
        roxxxy: 'HIGH', ivy: 'HIGH',
        alaska: 'SAFE', jinkx: 'SAFE', detox: 'SAFE', coco: 'SAFE',
        alyssa: 'SAFE', jade: 'SAFE', honey: 'SAFE', vivienne: 'SAFE',
        monica: 'BTM2', serena: 'BTM2',
      },
      eliminated: ['serena'],
    },
    // Ep 3: "Draggle Rock" — kids' TV show parody, scripted
    {
      number: 3,
      archetype: 'actingSketch',
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
    // Ep 4: "Black Swan: Why It Gotta Be Black?" — pure ballet-themed dance — DOUBLE ELIMINATION.
    // Archetype mismatch: no pure-dance archetype exists; girlGroup is the closest fit but overweights music.
    {
      number: 4,
      archetype: 'girlGroup',
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
    // Ep 5: "Snatch Game"
    {
      number: 5,
      archetype: 'snatchGame',
      challengeName: 'Snatch Game',
      placements: {
        jinkx: 'WIN',
        alaska: 'HIGH', roxxxy: 'HIGH',
        ivy: 'SAFE', coco: 'SAFE', alyssa: 'SAFE',
        jade: 'LOW',
        detox: 'BTM2', lineysha: 'BTM2',
      },
      eliminated: ['lineysha'],
    },
    // Ep 6: "Can I Get an Amen?" — gospel solo-singing showcase.
    // Archetype mismatch: closest fit is girlGroup, which overweights dance for a singing challenge.
    {
      number: 6,
      archetype: 'girlGroup',
      challengeName: 'Can I Get an Amen?',
      placements: {
        ivy: 'WIN',
        jinkx: 'HIGH', roxxxy: 'HIGH',
        alaska: 'SAFE', alyssa: 'SAFE', detox: 'SAFE',
        coco: 'BTM2', jade: 'BTM2',
      },
      eliminated: ['jade'],
    },
    // Ep 7: "RuPaul Roast" — stand-up roast — NON-ELIMINATION
    {
      number: 7,
      archetype: 'standUpRoast',
      challengeName: 'RuPaul Roast',
      placements: {
        coco: 'WIN',
        alaska: 'HIGH', jinkx: 'HIGH',
        ivy: 'SAFE', detox: 'SAFE',
        alyssa: 'BTM2', roxxxy: 'BTM2',
      },
      eliminated: [],
    },
    // Ep 8: "Scent of a Drag Queen" — perfume commercial, self-written
    {
      number: 8,
      archetype: 'branding',
      challengeName: 'Scent of a Drag Queen',
      placements: {
        alaska: 'WIN',
        detox: 'HIGH', jinkx: 'HIGH',
        roxxxy: 'SAFE', coco: 'SAFE',
        alyssa: 'BTM2', ivy: 'BTM2',
      },
      eliminated: ['ivy'],
    },
    // Ep 9: "Drama Queens" — telenovela scripted scenes
    {
      number: 9,
      archetype: 'actingSketch',
      challengeName: 'Drama Queens',
      placements: {
        jinkx: 'WIN',
        alaska: 'HIGH', roxxxy: 'HIGH',
        detox: 'SAFE',
        alyssa: 'BTM2', coco: 'BTM2',
      },
      eliminated: ['alyssa'],
    },
    // Ep 10: "Super Troopers" — makeover of military men
    {
      number: 10,
      archetype: 'makeover',
      challengeName: 'Super Troopers',
      placements: {
        roxxxy: 'WIN',
        jinkx: 'HIGH',
        alaska: 'SAFE',
        coco: 'BTM2', detox: 'BTM2',
      },
      eliminated: ['coco'],
    },
    // Ep 11: "Sugar Ball" — three-look ball
    {
      number: 11,
      archetype: 'ball',
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
