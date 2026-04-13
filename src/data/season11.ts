import type { SeasonData } from '../engine/types';

// Skill ratings are 1-10, based on actual Season 11 performance.
// Calibrated against Season 5 Jinkx Monsoon (comedy:10, design:5, acting:9, dance:5, snatchGame:10, improv:9, runway:5, singing:8, lipSync:6).
// Challenge wins -> 7-10 in relevant category; bottoms/eliminations -> 3-5.
const season11: SeasonData = {
  id: 'season11',
  name: 'Season 11',
  queens: [
    {
      id: 'yvie',
      name: 'Yvie Oddly',
      // Won Ep2 acting challenge (shared). High in Ep3 (diva/comedy), Ep5 (ball/design),
      // Ep6 (dance), Ep7 (design). BTM2 in Ep8 (Snatch Game). Won finale lip syncs.
      // Known for contortion, acrobatics, creative/weird runways.
      skills: {
        comedy: 7,
        design: 8,
        acting: 8,
        dance: 8,
        snatchGame: 3,
        improv: 6,
        runway: 8,
        singing: 5,
      },
      lipSync: 9,
      color: '#8e44ad',
    },
    {
      id: 'brookelynn',
      name: 'Brooke Lynn Hytes',
      // Won Ep1 (sewing), Ep5 (Monster Ball/design), Ep11 (makeover).
      // High in Ep2 (acting). BTM2 in Ep8 (Snatch Game), BTM2 in Ep12 (singing).
      // Professional ballet dancer. Top 3 nine times. Strong runway.
      skills: {
        comedy: 5,
        design: 8,
        acting: 6,
        dance: 10,
        snatchGame: 3,
        improv: 6,
        runway: 9,
        singing: 5,
      },
      lipSync: 8,
      color: '#e91e90',
    },
    {
      id: 'silky',
      name: 'Silky Nutmeg Ganache',
      // Won Ep4 (Trump Rusical/singing), Won Ep8 (Snatch Game).
      // High in Ep3 (diva/comedy), Ep9 (improv). Low in Ep5 (ball), Ep10 (magic).
      // BTM2 in Ep11 (makeover). Big personality, strong comedy/improv.
      skills: {
        comedy: 7,
        design: 4,
        acting: 6,
        dance: 6,
        snatchGame: 7,
        improv: 7,
        runway: 5,
        singing: 8,
      },
      lipSync: 5,
      color: '#e67e22',
    },
    {
      id: 'akeria',
      name: "A'Keria Chanel Davenport",
      // Won Ep6 (Draglympics/dance), Won Ep9 (LADP/improv).
      // High in Ep8 (Snatch Game), Ep12 (singing). BTM in Ep3 (6-way lip sync),
      // BTM2 in Ep7 (design). Strong runway, pageant queen.
      skills: {
        comedy: 5,
        design: 6,
        acting: 6,
        dance: 8,
        snatchGame: 7,
        improv: 8,
        runway: 8,
        singing: 6,
      },
      lipSync: 7,
      color: '#c0392b',
    },
    {
      id: 'vanjie',
      name: 'Vanessa Vanjie Mateo',
      // No challenge wins. Safe most weeks. Low in Ep4 (Rusical).
      // BTM2 in Ep9 (improv), Ep10 (magic). Eliminated Ep12 (singing).
      // Won lip syncs vs Plastique and Shuga. Entertaining personality.
      skills: {
        comedy: 6,
        design: 4,
        acting: 5,
        dance: 6,
        snatchGame: 5,
        improv: 5,
        runway: 6,
        singing: 4,
      },
      lipSync: 7,
      color: '#f39c12',
    },
    {
      id: 'nina',
      name: 'Nina West',
      // Won Ep3 (Diva Worship/comedy), Won Ep10 (Dragracadabra/magic-performance).
      // High in Ep8 (Snatch Game). Low in Ep1 (sewing), Ep6 (dance).
      // BTM2 Ep11 (makeover), eliminated. Miss Congeniality. Theater background.
      skills: {
        comedy: 8,
        design: 5,
        acting: 7,
        dance: 4,
        snatchGame: 7,
        improv: 7,
        runway: 6,
        singing: 7,
      },
      lipSync: 4,
      color: '#3498db',
    },
    {
      id: 'shuga',
      name: 'Shuga Cain',
      // No wins. High in Ep2 (acting), Ep3 (diva/comedy - survived 6-way),
      // Ep6 (dance team), Ep8 (Snatch Game as Charo). Low in Ep9 (improv).
      // BTM2 Ep5 (ball - won LS vs Ariel), BTM2 Ep10 (magic - eliminated).
      skills: {
        comedy: 6,
        design: 5,
        acting: 6,
        dance: 5,
        snatchGame: 7,
        improv: 5,
        runway: 7,
        singing: 5,
      },
      lipSync: 6,
      color: '#1abc9c',
    },
    {
      id: 'plastique',
      name: 'Plastique Tiara',
      // Won Ep7 (Farm to Runway/design). Safe most other weeks.
      // BTM in Ep3 (6-way lip sync - survived). BTM2 Ep9 (improv - eliminated).
      // Strong runway/fashion, but struggled in performance challenges.
      skills: {
        comedy: 4,
        design: 8,
        acting: 4,
        dance: 6,
        snatchGame: 5,
        improv: 3,
        runway: 9,
        singing: 4,
      },
      lipSync: 5,
      color: '#ff69b4',
    },
    {
      id: 'rajah',
      name: "Ra'Jah O'Hara",
      // No wins. BTM in Ep3 (6-way - survived), BTM2 Ep4 (Rusical - won LS),
      // BTM2 Ep6 (dance - won LS), BTM2 Ep7 (design - eliminated).
      // Won 3 lip syncs before elimination. Strong lip sync assassin.
      skills: {
        comedy: 4,
        design: 4,
        acting: 5,
        dance: 6,
        snatchGame: 4,
        improv: 5,
        runway: 5,
        singing: 5,
      },
      lipSync: 9,
      color: '#9b59b6',
    },
    {
      id: 'ariel',
      name: 'Ariel Versace',
      // No wins. Safe most weeks. BTM2 Ep5 (Monster Ball - eliminated).
      // Known for wigs and social media aesthetic. Fashion-focused but
      // couldn't execute design challenges well enough.
      skills: {
        comedy: 4,
        design: 5,
        acting: 4,
        dance: 5,
        snatchGame: 4,
        improv: 4,
        runway: 7,
        singing: 4,
      },
      lipSync: 4,
      color: '#e74c3c',
    },
    {
      id: 'scarlet',
      name: 'Scarlet Envy',
      // Won Ep2 (acting - shared with Yvie). BTM in Ep3 (6-way - survived).
      // BTM2 Ep6 (dance - eliminated). Good fashion sense, but inconsistent.
      skills: {
        comedy: 5,
        design: 5,
        acting: 7,
        dance: 4,
        snatchGame: 5,
        improv: 5,
        runway: 7,
        singing: 4,
      },
      lipSync: 5,
      color: '#2ecc71',
    },
    {
      id: 'mercedes',
      name: 'Mercedes Iman Diamond',
      // No wins. Safe Ep1, Ep3. Low Ep2 area. BTM2 Ep2 (acting - won LS vs Kahanna),
      // BTM2 Ep4 (Rusical - eliminated). First Muslim queen on the show.
      skills: {
        comedy: 3,
        design: 4,
        acting: 3,
        dance: 5,
        snatchGame: 3,
        improv: 3,
        runway: 5,
        singing: 4,
      },
      lipSync: 6,
      color: '#d4a574',
    },
    {
      id: 'honeyD',
      name: 'Honey Davenport',
      // No wins. Safe Ep1, Ep2. Eliminated in Ep3 6-way lip sync.
      // Member of the Davenport drag family.
      skills: {
        comedy: 4,
        design: 4,
        acting: 4,
        dance: 5,
        snatchGame: 3,
        improv: 4,
        runway: 5,
        singing: 4,
      },
      lipSync: 3,
      color: '#f1c40f',
    },
    {
      id: 'kahanna',
      name: 'Kahanna Montrese',
      // No wins. BTM2 Ep1 (sewing - won LS vs Soju with backflip),
      // BTM2 Ep2 (acting - eliminated). Daughter of Coco Montrese.
      // Athletic but limited challenge skills shown.
      skills: {
        comedy: 3,
        design: 3,
        acting: 3,
        dance: 6,
        snatchGame: 3,
        improv: 3,
        runway: 4,
        singing: 4,
      },
      lipSync: 7,
      color: '#7f8c8d',
    },
    {
      id: 'soju',
      name: 'Soju',
      // First eliminated Ep1 (sewing challenge). Lost LS to Kahanna.
      // YouTube personality, limited competition showing.
      skills: {
        comedy: 4,
        design: 2,
        acting: 3,
        dance: 3,
        snatchGame: 3,
        improv: 3,
        runway: 3,
        singing: 3,
      },
      lipSync: 2,
      color: '#16a085',
    },
  ],
  episodes: [
    // Ep 1: "Whatcha Unpackin?" (design/sewing - create looks from past queens' materials)
    {
      number: 1,
      challengeType: 'design',
      challengeName: 'Whatcha Unpackin?',
      placements: {
        brookelynn: 'WIN',
        plastique: 'HIGH', shuga: 'HIGH', yvie: 'HIGH',
        akeria: 'SAFE', scarlet: 'SAFE', vanjie: 'SAFE', ariel: 'SAFE',
        honeyD: 'SAFE', mercedes: 'SAFE', rajah: 'SAFE',
        nina: 'LOW', silky: 'LOW',
        kahanna: 'BTM2', soju: 'BTM2',
      },
      eliminated: ['soju'],
    },
    // Ep 2: "Good God Girl, Get Out" (acting - movie spoofs of Get Out / Black Panther)
    {
      number: 2,
      challengeType: 'acting',
      challengeName: 'Good God Girl, Get Out',
      placements: {
        scarlet: 'WIN', yvie: 'WIN',
        plastique: 'HIGH', shuga: 'HIGH',
        brookelynn: 'SAFE', akeria: 'SAFE', silky: 'SAFE', vanjie: 'SAFE',
        nina: 'SAFE', rajah: 'SAFE', ariel: 'SAFE', honeyD: 'SAFE',
        kahanna: 'BTM2', mercedes: 'BTM2',
      },
      eliminated: ['kahanna'],
    },
    // Ep 3: "Diva Worship" (comedy - diva talk show performances)
    {
      number: 3,
      challengeType: 'comedy',
      challengeName: 'Diva Worship',
      placements: {
        nina: 'WIN',
        yvie: 'HIGH', silky: 'HIGH',
        brookelynn: 'SAFE', vanjie: 'SAFE', ariel: 'SAFE',
        kahanna: 'SAFE', mercedes: 'SAFE',
        akeria: 'BTM2', honeyD: 'BTM2', plastique: 'BTM2',
        rajah: 'BTM2', scarlet: 'BTM2', shuga: 'BTM2',
      },
      eliminated: ['honeyD'],
    },
    // Ep 4: "Trump: The Rusical" (singing/musical performance)
    {
      number: 4,
      challengeType: 'singing',
      challengeName: 'Trump: The Rusical',
      placements: {
        silky: 'WIN',
        yvie: 'HIGH', brookelynn: 'HIGH',
        akeria: 'SAFE', nina: 'SAFE', shuga: 'SAFE',
        plastique: 'SAFE', scarlet: 'SAFE',
        vanjie: 'LOW',
        rajah: 'BTM2', mercedes: 'BTM2',
      },
      eliminated: ['mercedes'],
    },
    // Ep 5: "Monster Ball" (design - three Halloween looks, one constructed)
    {
      number: 5,
      challengeType: 'design',
      challengeName: 'Monster Ball',
      placements: {
        brookelynn: 'WIN',
        yvie: 'HIGH', plastique: 'HIGH',
        akeria: 'SAFE', nina: 'SAFE', vanjie: 'SAFE', scarlet: 'SAFE', rajah: 'SAFE',
        silky: 'LOW',
        ariel: 'BTM2', shuga: 'BTM2',
      },
      eliminated: ['ariel'],
    },
    // Ep 6: "The Draglympics" (dance - choreography/dance team performance)
    {
      number: 6,
      challengeType: 'dance',
      challengeName: 'The Draglympics',
      placements: {
        akeria: 'WIN',
        brookelynn: 'HIGH', yvie: 'HIGH', silky: 'HIGH', shuga: 'HIGH',
        vanjie: 'SAFE', plastique: 'SAFE',
        nina: 'LOW',
        rajah: 'BTM2', scarlet: 'BTM2',
      },
      eliminated: ['scarlet'],
    },
    // Ep 7: "From Farm to Runway" (design - organic materials unconventional design)
    {
      number: 7,
      challengeType: 'design',
      challengeName: 'From Farm to Runway',
      placements: {
        plastique: 'WIN',
        brookelynn: 'HIGH', yvie: 'HIGH',
        silky: 'SAFE', vanjie: 'SAFE', nina: 'SAFE', shuga: 'SAFE',
        akeria: 'BTM2', rajah: 'BTM2',
      },
      eliminated: ['rajah'],
    },
    // Ep 8: "Snatch Game at Sea" (snatchGame - celebrity impersonation)
    {
      number: 8,
      challengeType: 'snatchGame',
      challengeName: 'Snatch Game at Sea',
      placements: {
        silky: 'WIN',
        nina: 'HIGH', shuga: 'HIGH',
        akeria: 'SAFE', plastique: 'SAFE', vanjie: 'SAFE',
        brookelynn: 'BTM2', yvie: 'BTM2',
      },
      eliminated: [],  // double shantay
    },
    // Ep 9: "L.A.D.P.!" (improv - improvised police sketch comedy)
    {
      number: 9,
      challengeType: 'improv',
      challengeName: 'L.A.D.P.!',
      placements: {
        akeria: 'WIN',
        silky: 'HIGH', brookelynn: 'HIGH',
        yvie: 'SAFE', nina: 'SAFE',
        shuga: 'LOW',
        plastique: 'BTM2', vanjie: 'BTM2',
      },
      eliminated: ['plastique'],
    },
    // Ep 10: "Dragracadabra" (acting/comedy - magic show performance)
    {
      number: 10,
      challengeType: 'acting',
      challengeName: 'Dragracadabra',
      placements: {
        nina: 'WIN',
        brookelynn: 'HIGH', yvie: 'HIGH',
        akeria: 'SAFE',
        silky: 'LOW',
        shuga: 'BTM2', vanjie: 'BTM2',
      },
      eliminated: ['shuga'],
    },
    // Ep 11: "Bring Back My Queens!" (design - makeover challenge)
    {
      number: 11,
      challengeType: 'design',
      challengeName: 'Bring Back My Queens!',
      placements: {
        brookelynn: 'WIN',
        akeria: 'HIGH', vanjie: 'HIGH',
        yvie: 'SAFE',
        silky: 'BTM2', nina: 'BTM2',
      },
      eliminated: ['nina'],
    },
    // Ep 12: "Queens Everywhere" (singing - write/record verse, performance)
    {
      number: 12,
      challengeType: 'singing',
      challengeName: 'Queens Everywhere',
      placements: {
        yvie: 'HIGH', akeria: 'HIGH', silky: 'HIGH',
        brookelynn: 'BTM2', vanjie: 'BTM2',
      },
      eliminated: ['vanjie'],
    },
  ],
};

export default season11;
