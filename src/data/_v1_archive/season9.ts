import type { SeasonData } from '../engine/types';

// Skill ratings are 1-10, based on actual Season 9 performance.
// Calibrated against Season 5 (e.g. Jinkx: comedy:10, design:5, acting:9,
// dance:5, snatchGame:10, improv:9, runway:5, singing:8, lipSync:6).
const season9: SeasonData = {
  id: 'season9',
  name: 'Season 9',
  queens: [
    {
      id: 'sasha',
      name: 'Sasha Velour',
      // 2 shared wins (comedy/acting Ep4, acting/improv Ep9), consistently HIGH.
      // Never bottom 2. Iconic finale lip syncs. Strong runway, brainy comedy.
      // Low in acting Ep7 (9021-HO).
      skills: {
        comedy: 8,
        design: 9,
        acting: 7,
        dance: 5,
        snatchGame: 8,
        improv: 8,
        runway: 9,
        singing: 6,
      },
      lipSync: 9,
      color: '#e74c3c',
    },
    {
      id: 'peppermint',
      name: 'Peppermint',
      // 1 win (roast Ep8). Runner-up. Lip synced 2x for her life and won both.
      // Legendary finale lip sync performer. Weak runway (repeatedly critiqued).
      // LOW/BTM in Snatch Game. HIGH in musical Ep5 and comedy Ep8.
      skills: {
        comedy: 8,
        design: 4,
        acting: 7,
        dance: 6,
        snatchGame: 4,
        improv: 6,
        runway: 4,
        singing: 7,
      },
      lipSync: 9,
      color: '#ff69b4',
    },
    {
      id: 'shea',
      name: 'Shea Coulee',
      // 4 wins (most of the season): Ep4 comedy, Ep5 musical, Ep9 improv, Ep11 ball.
      // Costume design degree. Strong runway, dance, acting. Only 1 BTM2 (makeover Ep10).
      // Lost iconic finale lip sync to Sasha. Well-rounded powerhouse.
      skills: {
        comedy: 7,
        design: 8,
        acting: 8,
        dance: 8,
        snatchGame: 7,
        improv: 8,
        runway: 9,
        singing: 7,
      },
      lipSync: 8,
      color: '#3498db',
    },
    {
      id: 'trinity',
      name: 'Trinity Taylor',
      // 3 wins: Ep3 design, Ep7 acting, Ep10 makeover. Pageant queen with great body.
      // BTM2 once (Ep4 comedy vs Charlie, easy win). LOW in roast Ep8 and ball Ep11.
      // Lost finale lip sync to Peppermint. Strong design, acting, weak comedy/improv.
      skills: {
        comedy: 5,
        design: 8,
        acting: 8,
        dance: 7,
        snatchGame: 6,
        improv: 5,
        runway: 8,
        singing: 5,
      },
      lipSync: 7,
      color: '#9b59b6',
    },
    {
      id: 'alexis',
      name: 'Alexis Michelle',
      // 1 win (Snatch Game as Liza). Broadway background. 5th place.
      // BTM2 three times (roast Ep8, ball Ep11, plus early low placements).
      // Strong singing/theatre, struggled with design and comedy roast.
      skills: {
        comedy: 5,
        design: 5,
        acting: 7,
        dance: 5,
        snatchGame: 8,
        improv: 6,
        runway: 5,
        singing: 8,
      },
      lipSync: 7,
      color: '#2ecc71',
    },
    {
      id: 'nina',
      name: "Nina Bo'nina Brown",
      // 1 win (Ep1 pageant/runway). HIGH in Snatch Game (Jasmine Masters).
      // BTM2 three times (Ep7, Ep9, Ep10). Amazing makeup/creativity.
      // Self-sabotage hurt her. Eliminated Aja and Valentina in lip syncs.
      skills: {
        comedy: 5,
        design: 8,
        acting: 5,
        dance: 4,
        snatchGame: 7,
        improv: 4,
        runway: 7,
        singing: 4,
      },
      lipSync: 7,
      color: '#e67e22',
    },
    {
      id: 'valentina',
      name: 'Valentina',
      // 1 win (Ep2 cheerleading). HIGH multiple times (design Ep3, acting Ep7).
      // Eliminated in the infamous mask lip sync (didn't know the words).
      // Beautiful runway, polished, but limited versatility. Weak lip sync.
      skills: {
        comedy: 4,
        design: 6,
        acting: 6,
        dance: 6,
        snatchGame: 5,
        improv: 4,
        runway: 9,
        singing: 5,
      },
      lipSync: 6,
      color: '#f1c40f',
    },
    {
      id: 'farrah',
      name: 'Farrah Moan',
      // No wins. LOW or BTM2 repeatedly (Ep3, Ep5, Ep6, Ep8). 8th place.
      // Pretty but struggled with comedy, acting, performance challenges.
      // Eliminated in roast. Weak across performance categories.
      skills: {
        comedy: 2,
        design: 5,
        acting: 3,
        dance: 4,
        snatchGame: 3,
        improv: 3,
        runway: 7,
        singing: 4,
      },
      lipSync: 4,
      color: '#ffb6c1',
    },
    {
      id: 'aja',
      name: 'Aja',
      // No wins. BTM2 twice (Ep3 design, Ep7 acting). 9th place.
      // Raw talent but unpolished on S9. Improved dramatically on All Stars 3.
      // Decent dance/lip sync ability, weak design and acting on this season.
      skills: {
        comedy: 5,
        design: 4,
        acting: 4,
        dance: 8,
        snatchGame: 4,
        improv: 5,
        runway: 5,
        singing: 5,
      },
      lipSync: 8,
      color: '#1abc9c',
    },
    {
      id: 'eureka',
      name: 'Eureka',
      // No wins, no bottoms before medical exit Ep5. HIGH in Ep1 pageant.
      // Showed promise before torn ACL. Limited data. Returned on S10 as runner-up.
      // Big personality, decent across categories.
      skills: {
        comedy: 7,
        design: 5,
        acting: 6,
        dance: 5,
        snatchGame: 5,
        improv: 6,
        runway: 6,
        singing: 5,
      },
      lipSync: 6,
      color: '#c0392b',
    },
    {
      id: 'cynthia',
      name: 'Cynthia Lee Fontaine',
      // No wins. Returning queen from S8. LOW/BTM2 repeatedly (Ep5, Ep6).
      // Eliminated Ep6 Snatch Game. Lovable personality but struggled with
      // impersonation and polish. Cucu!
      skills: {
        comedy: 5,
        design: 4,
        acting: 4,
        dance: 5,
        snatchGame: 2,
        improv: 4,
        runway: 4,
        singing: 4,
      },
      lipSync: 5,
      color: '#d4a574',
    },
    {
      id: 'jaymes',
      name: 'Jaymes Mansfield',
      // First eliminated (Ep2). BTM2 in cheerleading challenge.
      // Wig-styling talent but very nervous on the show. Limited data.
      skills: {
        comedy: 4,
        design: 5,
        acting: 3,
        dance: 3,
        snatchGame: 3,
        improv: 3,
        runway: 4,
        singing: 3,
      },
      lipSync: 3,
      color: '#8e44ad',
    },
    {
      id: 'kimora',
      name: 'Kimora Blac',
      // Eliminated Ep3 (design). BTM2 twice (Ep2, Ep3). LOW Ep2 cheerleading.
      // Gorgeous but couldn't sew and struggled in performance challenges.
      skills: {
        comedy: 3,
        design: 3,
        acting: 3,
        dance: 4,
        snatchGame: 3,
        improv: 3,
        runway: 6,
        singing: 3,
      },
      lipSync: 4,
      color: '#f39c12',
    },
    {
      id: 'charlie',
      name: 'Charlie Hides',
      // Eliminated Ep4. LOW in Ep2 cheerleading. BTM2 Ep4 (comedy/acting).
      // Infamous for not lip syncing (stood still due to cracked rib).
      // Comedy background (YouTube) but flopped on the show. Oldest queen at 52.
      skills: {
        comedy: 5,
        design: 5,
        acting: 4,
        dance: 2,
        snatchGame: 5,
        improv: 4,
        runway: 6,
        singing: 5,
      },
      lipSync: 1,
      color: '#7f8c8d',
    },
  ],
  episodes: [
    // Ep 1: "Oh. My. Gaga!" — Pageant (two looks: hometown + Lady Gaga inspired)
    // No elimination this episode
    {
      number: 1,
      challengeType: 'runway',
      challengeWeights: { comedy: 0, design: 0, acting: 0, dance: 0, snatchGame: 0, improv: 0, runway: 1, singing: 0 },
      challengeName: 'Oh. My. Gaga!',
      placements: {
        nina: 'WIN',
        eureka: 'HIGH', sasha: 'HIGH',
        peppermint: 'SAFE', shea: 'SAFE', trinity: 'SAFE',
        alexis: 'SAFE', valentina: 'SAFE', farrah: 'SAFE',
        aja: 'SAFE', cynthia: 'SAFE', jaymes: 'SAFE',
        kimora: 'SAFE', charlie: 'SAFE',
      },
      eliminated: [],
    },
    // Ep 2: "She Done Already Done Brought It On" — Team Cheerleading
    {
      number: 2,
      challengeType: 'dance',
      challengeWeights: { comedy: 0, design: 0, acting: 0, dance: 1, snatchGame: 0, improv: 0, runway: 0, singing: 0 },
      challengeName: 'She Done Already Done Brought It On',
      placements: {
        valentina: 'WIN',
        shea: 'HIGH', trinity: 'HIGH',
        nina: 'SAFE', sasha: 'SAFE', peppermint: 'SAFE',
        alexis: 'SAFE', farrah: 'SAFE', aja: 'SAFE',
        eureka: 'SAFE', cynthia: 'SAFE',
        charlie: 'LOW',
        jaymes: 'BTM2', kimora: 'BTM2',
      },
      eliminated: ['jaymes'],
    },
    // Ep 3: "Draggily Ever After" — Fairytale Princess Design
    {
      number: 3,
      challengeType: 'design',
      challengeWeights: { comedy: 0, design: 1, acting: 0, dance: 0, snatchGame: 0, improv: 0, runway: 0, singing: 0 },
      challengeName: 'Draggily Ever After',
      placements: {
        trinity: 'WIN',
        peppermint: 'HIGH', valentina: 'HIGH',
        nina: 'SAFE', sasha: 'SAFE', shea: 'SAFE',
        alexis: 'SAFE', eureka: 'SAFE', charlie: 'SAFE',
        cynthia: 'SAFE',
        farrah: 'LOW',
        aja: 'BTM2', kimora: 'BTM2',
      },
      eliminated: ['kimora'],
    },
    // Ep 4: "Good Morning Bitches" — Morning Talk Show (comedy/acting)
    {
      number: 4,
      challengeType: 'comedy',
      challengeWeights: { comedy: 1, design: 0, acting: 0, dance: 0, snatchGame: 0, improv: 0, runway: 0, singing: 0 },
      challengeName: 'Good Morning Bitches',
      placements: {
        sasha: 'WIN', shea: 'WIN',
        nina: 'SAFE', valentina: 'SAFE', alexis: 'SAFE',
        aja: 'SAFE', eureka: 'SAFE', farrah: 'SAFE',
        cynthia: 'SAFE',
        peppermint: 'LOW',
        charlie: 'BTM2', trinity: 'BTM2',
      },
      eliminated: ['charlie'],
    },
    // Ep 5: "Reality Stars: The Musical" — Kardashian Musical
    {
      number: 5,
      challengeType: 'singing',
      challengeWeights: { comedy: 0, design: 0, acting: 0, dance: 0, snatchGame: 0, improv: 0, runway: 0, singing: 1 },
      challengeName: 'Reality Stars: The Musical',
      placements: {
        shea: 'WIN',
        alexis: 'HIGH', peppermint: 'HIGH',
        sasha: 'SAFE', trinity: 'SAFE', valentina: 'SAFE',
        aja: 'SAFE',
        nina: 'LOW',
        cynthia: 'BTM2', farrah: 'BTM2',
      },
      // Eureka removed due to knee injury; both BTM2 queens saved
      eliminated: ['eureka'],
    },
    // Ep 6: "Snatch Game"
    {
      number: 6,
      challengeType: 'snatchGame',
      challengeWeights: { comedy: 0, design: 0, acting: 0, dance: 0, snatchGame: 1, improv: 0, runway: 0, singing: 0 },
      challengeName: 'Snatch Game',
      placements: {
        alexis: 'WIN',
        nina: 'HIGH', sasha: 'HIGH',
        shea: 'SAFE', trinity: 'SAFE', valentina: 'SAFE',
        aja: 'SAFE',
        farrah: 'LOW',
        cynthia: 'BTM2', peppermint: 'BTM2',
      },
      eliminated: ['cynthia'],
    },
    // Ep 7: "9021-HO" — 90210 Parody (acting)
    {
      number: 7,
      challengeType: 'acting',
      challengeWeights: { comedy: 0, design: 0, acting: 1, dance: 0, snatchGame: 0, improv: 0, runway: 0, singing: 0 },
      challengeName: '9021-HO',
      placements: {
        trinity: 'WIN',
        shea: 'HIGH', valentina: 'HIGH',
        peppermint: 'SAFE', alexis: 'SAFE', farrah: 'SAFE',
        sasha: 'LOW',
        aja: 'BTM2', nina: 'BTM2',
      },
      eliminated: ['aja'],
    },
    // Ep 8: "RuPaul Roast" — Comedy Roast of Michelle Visage
    {
      number: 8,
      challengeType: 'comedy',
      challengeWeights: { comedy: 1, design: 0, acting: 0, dance: 0, snatchGame: 0, improv: 0, runway: 0, singing: 0 },
      challengeName: 'RuPaul Roast',
      placements: {
        peppermint: 'WIN',
        sasha: 'HIGH', shea: 'HIGH',
        nina: 'SAFE', valentina: 'SAFE',
        trinity: 'LOW',
        alexis: 'BTM2', farrah: 'BTM2',
      },
      eliminated: ['farrah'],
    },
    // Ep 9: "Your Pilot's on Fire" — Create TV Pilots (acting/improv)
    {
      number: 9,
      challengeType: 'improv',
      challengeWeights: { comedy: 0, design: 0, acting: 0, dance: 0, snatchGame: 0, improv: 1, runway: 0, singing: 0 },
      challengeName: "Your Pilot's on Fire",
      placements: {
        sasha: 'WIN', shea: 'WIN',
        peppermint: 'HIGH', trinity: 'HIGH',
        alexis: 'LOW',
        nina: 'BTM2', valentina: 'BTM2',
      },
      eliminated: ['valentina'],
    },
    // Ep 10: "Makeovers: Crew Better Work" — Makeover Challenge
    {
      number: 10,
      challengeType: 'design',
      challengeWeights: { comedy: 0, design: 1, acting: 0, dance: 0, snatchGame: 0, improv: 0, runway: 0, singing: 0 },
      challengeName: 'Makeovers: Crew Better Work',
      placements: {
        trinity: 'WIN',
        sasha: 'HIGH',
        peppermint: 'SAFE', alexis: 'SAFE',
        shea: 'LOW',
        nina: 'BTM2',
      },
      // Nina was BTM2 against Shea; Nina eliminated
      eliminated: ['nina'],
    },
    // Ep 11: "Gayest Ball Ever" — Three-Look Ball (design)
    {
      number: 11,
      challengeType: 'design',
      challengeWeights: { comedy: 0, design: 1, acting: 0, dance: 0, snatchGame: 0, improv: 0, runway: 0, singing: 0 },
      challengeName: 'Gayest Ball Ever',
      placements: {
        shea: 'WIN',
        sasha: 'HIGH',
        trinity: 'LOW',
        alexis: 'BTM2', peppermint: 'BTM2',
      },
      eliminated: ['alexis'],
    },
    // Ep 12: "Category Is..." — Write & Perform Verses (singing/performance)
    // No elimination; top 4 advance to finale
    {
      number: 12,
      challengeType: 'singing',
      challengeWeights: { comedy: 0, design: 0, acting: 0, dance: 0, snatchGame: 0, improv: 0, runway: 0, singing: 1 },
      challengeName: 'Category Is...',
      placements: {
        sasha: 'SAFE', shea: 'SAFE', trinity: 'SAFE', peppermint: 'SAFE',
      },
      eliminated: [],
    },
    // Finale
    {
      kind: 'finale',
      finaleType: 'default',
      number: 13,
      challengeName: 'Grand Finale',
      placements: {},
      eliminated: [],
    },
  ],
};

export default season9;
