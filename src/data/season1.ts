import type { SeasonData } from '../engine/types';

const season1: SeasonData = {
  id: 'season1',
  name: 'Season 1',
  queens: [
    {
      id: 'bebe',
      name: 'BeBe Zahara Benet',
      skills: { comedy: 6, design: 7, acting: 6, dance: 7, snatchGame: 5, improv: 6, runway: 8, singing: 6 },
      lipSync: 8,
      color: '#e6194b',
    },
    {
      id: 'nina',
      name: 'Nina Flowers',
      skills: { comedy: 6, design: 9, acting: 5, dance: 7, snatchGame: 5, improv: 6, runway: 9, singing: 6 },
      lipSync: 7,
      color: '#3cb44b',
    },
    {
      id: 'rebecca',
      name: 'Rebecca Glasscock',
      skills: { comedy: 4, design: 5, acting: 5, dance: 5, snatchGame: 4, improv: 4, runway: 6, singing: 4 },
      lipSync: 6,
      color: '#4363d8',
    },
    {
      id: 'shannel',
      name: 'Shannel',
      skills: { comedy: 5, design: 7, acting: 7, dance: 6, snatchGame: 6, improv: 6, runway: 8, singing: 5 },
      lipSync: 5,
      color: '#f58231',
    },
    {
      id: 'ongina',
      name: 'Ongina',
      skills: { comedy: 7, design: 6, acting: 7, dance: 5, snatchGame: 6, improv: 7, runway: 6, singing: 6 },
      lipSync: 5,
      color: '#911eb4',
    },
    {
      id: 'jade',
      name: 'Jade Sotomayor',
      skills: { comedy: 5, design: 5, acting: 5, dance: 6, snatchGame: 4, improv: 5, runway: 6, singing: 6 },
      lipSync: 5,
      color: '#42d4f4',
    },
    {
      id: 'akashia',
      name: 'Akashia',
      skills: { comedy: 4, design: 4, acting: 4, dance: 6, snatchGame: 3, improv: 4, runway: 5, singing: 4 },
      lipSync: 6,
      color: '#f032e6',
    },
    {
      id: 'tammie',
      name: 'Tammie Brown',
      skills: { comedy: 7, design: 5, acting: 5, dance: 4, snatchGame: 5, improv: 6, runway: 5, singing: 4 },
      lipSync: 3,
      color: '#bfef45',
    },
    {
      id: 'porkchop',
      name: 'Victoria "Porkchop" Parker',
      skills: { comedy: 4, design: 4, acting: 4, dance: 4, snatchGame: 3, improv: 4, runway: 4, singing: 4 },
      lipSync: 3,
      color: '#fabed4',
    },
  ],
  episodes: [
    {
      number: 1,
      challengeType: 'design',
      challengeName: 'Drag on a Dime',
      placements: {},
      eliminated: ['porkchop'],
    },
    {
      number: 2,
      challengeType: 'dance',
      challengeName: 'Girl Groups',
      placements: {},
      eliminated: ['tammie'],
    },
    {
      number: 3,
      challengeType: 'improv',
      challengeName: 'Queens of All Media',
      placements: {},
      eliminated: ['akashia'],
    },
    {
      number: 4,
      challengeType: 'acting',
      challengeName: 'MAC Viva Glam',
      placements: {},
      eliminated: ['jade'],
    },
    {
      number: 5,
      challengeType: 'design',
      challengeName: 'Drag School of Charm',
      placements: {},
      eliminated: ['ongina'],
    },
    {
      number: 6,
      challengeType: 'design',
      challengeName: 'The Absolut Ball',
      placements: {},
      eliminated: ['shannel'],
    },
    {
      number: 7,
      challengeType: 'singing',
      challengeName: 'Grand Finale',
      placements: {},
      eliminated: [],
    },
  ],
};

export default season1;
