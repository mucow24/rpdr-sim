// Source of truth for RPDR lip-sync data — hand-edit as needed.
//
// Every row was verified against Wikipedia on 2026-04-21 and carries a
// `verification` receipt with the exact page URL, pinned revision id, and
// sha256 of the cached HTML. To audit any row, fetch its pinned URL
// (…?oldid={revision}), sha256 the bytes, and confirm the `quote` string's
// pieces appear on the page. No tooling required.

export type SeasonId = string; // 's01' ... 's18', 'as01' ... 'as10'

export type LipSyncType =
  | 'regular'
  | 'legacy'
  | 'assassin'
  | 'for_the_win'
  | 'for_the_crown'
  | 'lalaparuza'
  | 'team'
  | 'reunion_assassin';

export type LipSyncOutcome =
  | 'single_winner'
  | 'multi_advance'
  | 'double_shantay'
  | 'double_sashay'
  | 'tie_with_elim'
  | 'self_elimination';

export type SongInfo = {
  title: string | null;
  artist: string | null;
  raw: string;
};

export type QueenId = string;

export type LipSyncSide = {
  label?: string;
  queens: QueenId[];
};

export type VerificationReceipt = {
  url: string;
  revision: number;
  sha256: string;
  fetchedAt: string;
  quote: string;
};

export type LipSync = {
  id: string;
  seasonId: SeasonId;
  episode: number;
  episodeLabel?: string;
  bracket?: string;
  round?: string;
  sequence: number;
  type: LipSyncType;
  outcome: LipSyncOutcome;
  song: SongInfo;
  sides: LipSyncSide[];
  winners: LipSyncSide[];
  eliminated: LipSyncSide[];
  notes?: string;
  verified: boolean;
  flags: string[];
  verification?: VerificationReceipt;
};

export const LIP_SYNCS_CANONICAL: LipSync[] = [
  {
    "id": "s01-e01-1",
    "seasonId": "s01",
    "episode": 1,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Supermodel (You Better Work)",
      "artist": "RuPaul",
      "raw": "\"Supermodel (You Better Work)\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "akashia"
        ]
      },
      {
        "queens": [
          "porkchop"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "akashia"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "porkchop"
        ]
      }
    ],
    "notes": "Porkchop sent home first",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_1",
      "revision": 1339825910,
      "sha256": "ca5c5a24dffc6467ec45d25a7f669cdee1aa8e2eea3a836e247c7a6a6cba19e6",
      "fetchedAt": "2026-04-21T22:37:27.454Z",
      "quote": "Ep 1: Akashia vs. Victoria \"Porkchop\" Parker — \"Supermodel (You Better Work)\" (RuPaul)"
    }
  },
  {
    "id": "s01-e02-1",
    "seasonId": "s01",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "We Break the Dawn",
      "artist": "Michelle Williams",
      "raw": "\"We Break the Dawn\" — Michelle Williams"
    },
    "sides": [
      {
        "queens": [
          "akashia"
        ]
      },
      {
        "queens": [
          "tammie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "akashia"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "tammie"
        ]
      }
    ],
    "notes": "Tammie's checked-out exit",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_1",
      "revision": 1339825910,
      "sha256": "ca5c5a24dffc6467ec45d25a7f669cdee1aa8e2eea3a836e247c7a6a6cba19e6",
      "fetchedAt": "2026-04-21T22:37:27.454Z",
      "quote": "Ep 2: Akashia vs. Tammie Brown — \"We Break the Dawn\" (Michelle Williams)"
    }
  },
  {
    "id": "s01-e03-1",
    "seasonId": "s01",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "The Greatest Love of All",
      "artist": "Whitney Houston",
      "raw": "\"The Greatest Love of All\" — Whitney Houston"
    },
    "sides": [
      {
        "queens": [
          "akashia"
        ]
      },
      {
        "queens": [
          "shannel"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shannel"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "akashia"
        ]
      }
    ],
    "notes": "Akashia finally sashays",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_1",
      "revision": 1339825910,
      "sha256": "ca5c5a24dffc6467ec45d25a7f669cdee1aa8e2eea3a836e247c7a6a6cba19e6",
      "fetchedAt": "2026-04-21T22:37:27.454Z",
      "quote": "Ep 3: Akashia vs. Shannel — \"The Greatest Love of All\" (Whitney Houston)"
    }
  },
  {
    "id": "s01-e04-1",
    "seasonId": "s01",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Would I Lie to You?",
      "artist": "Eurythmics",
      "raw": "\"Would I Lie to You?\" — Eurythmics"
    },
    "sides": [
      {
        "queens": [
          "jade"
        ]
      },
      {
        "queens": [
          "rebecca"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "rebecca"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jade"
        ]
      }
    ],
    "notes": "Jade goes quietly",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_1",
      "revision": 1339825910,
      "sha256": "ca5c5a24dffc6467ec45d25a7f669cdee1aa8e2eea3a836e247c7a6a6cba19e6",
      "fetchedAt": "2026-04-21T22:37:27.454Z",
      "quote": "Ep 4: Jade vs. Rebecca Glasscock — \"Would I Lie to You?\" (Eurythmics)"
    }
  },
  {
    "id": "s01-e05-1",
    "seasonId": "s01",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Stronger",
      "artist": "Britney Spears",
      "raw": "\"Stronger\" — Britney Spears"
    },
    "sides": [
      {
        "queens": [
          "bebe"
        ]
      },
      {
        "queens": [
          "ongina"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "bebe"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "ongina"
        ]
      }
    ],
    "notes": "Shocking Ongina elimination",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_1",
      "revision": 1339825910,
      "sha256": "ca5c5a24dffc6467ec45d25a7f669cdee1aa8e2eea3a836e247c7a6a6cba19e6",
      "fetchedAt": "2026-04-21T22:37:27.454Z",
      "quote": "Ep 5: BeBe Zahara Benet vs. Ongina — \"Stronger\" (Britney Spears)"
    }
  },
  {
    "id": "s01-e06-1",
    "seasonId": "s01",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Shackles (Praise You)",
      "artist": "Mary Mary",
      "raw": "\"Shackles (Praise You)\" — Mary Mary"
    },
    "sides": [
      {
        "queens": [
          "rebecca"
        ]
      },
      {
        "queens": [
          "shannel"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "rebecca"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "shannel"
        ]
      }
    ],
    "notes": "Shannel's upset exit",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_1",
      "revision": 1339825910,
      "sha256": "ca5c5a24dffc6467ec45d25a7f669cdee1aa8e2eea3a836e247c7a6a6cba19e6",
      "fetchedAt": "2026-04-21T22:37:27.454Z",
      "quote": "Ep 6: Rebecca Glasscock vs. Shannel — \"Shackles (Praise You)\" (Mary Mary)"
    }
  },
  {
    "id": "s01-e08-1",
    "seasonId": "s01",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Cover Girl (Put the Bass in Your Walk)",
      "artist": "RuPaul",
      "raw": "\"Cover Girl (Put the Bass in Your Walk)\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "bebe"
        ]
      },
      {
        "queens": [
          "nina_flowers"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "bebe"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "nina_flowers"
        ]
      }
    ],
    "notes": "Finale, BeBe crowned",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_1",
      "revision": 1339825910,
      "sha256": "ca5c5a24dffc6467ec45d25a7f669cdee1aa8e2eea3a836e247c7a6a6cba19e6",
      "fetchedAt": "2026-04-21T22:37:27.454Z",
      "quote": "Ep 8: BeBe Zahara Benet vs. Nina Flowers — \"Cover Girl (Put the Bass in Your Walk)\" (RuPaul)"
    }
  },
  {
    "id": "s02-e01-1",
    "seasonId": "s02",
    "episode": 1,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Cover Girl (Put the Bass in Your Walk)",
      "artist": "RuPaul",
      "raw": "\"Cover Girl (Put the Bass in Your Walk)\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "sahara"
        ]
      },
      {
        "queens": [
          "shangela"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "sahara"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "shangela"
        ]
      }
    ],
    "notes": "Shangela's box exit",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_2",
      "revision": 1348152014,
      "sha256": "d89c3110275a8e3e289fbc33fb2100892903ec2b74a30d679180edc004d61229",
      "fetchedAt": "2026-04-21T22:37:27.999Z",
      "quote": "Ep 1: Sahara Davenport vs. Shangela Laquifa Wadley — \"Cover Girl (Put the Bass in Your Walk)\" (RuPaul)"
    }
  },
  {
    "id": "s02-e02-1",
    "seasonId": "s02",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "My Lovin' (You're Never Gonna Get It)",
      "artist": "En Vogue",
      "raw": "\"My Lovin' (You're Never Gonna Get It)\" — En Vogue"
    },
    "sides": [
      {
        "queens": [
          "nicole"
        ]
      },
      {
        "queens": [
          "raven"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "raven"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "nicole"
        ]
      }
    ],
    "notes": "Raven's first win",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_2",
      "revision": 1348152014,
      "sha256": "d89c3110275a8e3e289fbc33fb2100892903ec2b74a30d679180edc004d61229",
      "fetchedAt": "2026-04-21T22:37:27.999Z",
      "quote": "Ep 2: Nicole Paige Brooks vs. Raven — \"My Lovin' (You're Never Gonna Get It)\" (En Vogue)"
    }
  },
  {
    "id": "s02-e03-1",
    "seasonId": "s02",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "I Hear You Knocking",
      "artist": "Wynonna Judd",
      "raw": "\"I Hear You Knockin'\" — Wynonna Judd"
    },
    "sides": [
      {
        "queens": [
          "mystique"
        ]
      },
      {
        "queens": [
          "raven"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "raven"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mystique"
        ]
      }
    ],
    "notes": "Raven dominates again",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_2",
      "revision": 1348152014,
      "sha256": "d89c3110275a8e3e289fbc33fb2100892903ec2b74a30d679180edc004d61229",
      "fetchedAt": "2026-04-21T22:37:27.999Z",
      "quote": "Ep 3: Mystique Summers Madison vs. Raven — \"I Hear You Knocking\" (Wynonna Judd)"
    }
  },
  {
    "id": "s02-e04-1",
    "seasonId": "s02",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Two of Hearts",
      "artist": "Stacey Q",
      "raw": "\"Two of Hearts\" — Stacey Q"
    },
    "sides": [
      {
        "queens": [
          "morgan"
        ]
      },
      {
        "queens": [
          "sonique"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "morgan"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "sonique"
        ]
      }
    ],
    "notes": "Sonique upset exit",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_2",
      "revision": 1348152014,
      "sha256": "d89c3110275a8e3e289fbc33fb2100892903ec2b74a30d679180edc004d61229",
      "fetchedAt": "2026-04-21T22:37:27.999Z",
      "quote": "Ep 4: Morgan McMichaels vs. Sonique — \"Two of Hearts\" (Stacey Q)"
    }
  },
  {
    "id": "s02-e05-1",
    "seasonId": "s02",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Carry On",
      "artist": "Martha Wash",
      "raw": "\"Carry On\" — Martha Wash"
    },
    "sides": [
      {
        "queens": [
          "morgan"
        ]
      },
      {
        "queens": [
          "sahara"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "sahara"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "morgan"
        ]
      }
    ],
    "notes": "Morgan sashays away",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_2",
      "revision": 1348152014,
      "sha256": "d89c3110275a8e3e289fbc33fb2100892903ec2b74a30d679180edc004d61229",
      "fetchedAt": "2026-04-21T22:37:27.999Z",
      "quote": "Ep 5: Morgan McMichaels vs. Sahara Davenport — \"Carry On\" (Martha Wash)"
    }
  },
  {
    "id": "s02-e06-1",
    "seasonId": "s02",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Black Velvet",
      "artist": "Alannah Myles",
      "raw": "\"Black Velvet\" — Alannah Myles"
    },
    "sides": [
      {
        "queens": [
          "jujubee"
        ]
      },
      {
        "queens": [
          "sahara"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jujubee"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "sahara"
        ]
      }
    ],
    "notes": "Juju's first win",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_2",
      "revision": 1348152014,
      "sha256": "d89c3110275a8e3e289fbc33fb2100892903ec2b74a30d679180edc004d61229",
      "fetchedAt": "2026-04-21T22:37:27.999Z",
      "quote": "Ep 6: Jujubee vs. Sahara Davenport — \"Black Velvet\" (Alannah Myles)"
    }
  },
  {
    "id": "s02-e07-1",
    "seasonId": "s02",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "He's the Greatest Dancer",
      "artist": "Sister Sledge",
      "raw": "\"He's the Greatest Dancer\" — Sister Sledge"
    },
    "sides": [
      {
        "queens": [
          "jessica"
        ]
      },
      {
        "queens": [
          "tatianna"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "tatianna"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jessica"
        ]
      }
    ],
    "notes": "Jessica's sweet exit",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_2",
      "revision": 1348152014,
      "sha256": "d89c3110275a8e3e289fbc33fb2100892903ec2b74a30d679180edc004d61229",
      "fetchedAt": "2026-04-21T22:37:27.999Z",
      "quote": "Ep 7: Jessica Wild vs. Tatianna — \"He's the Greatest Dancer\" (Sister Sledge)"
    }
  },
  {
    "id": "s02-e08-1",
    "seasonId": "s02",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Shake Your Love",
      "artist": "Debbie Gibson",
      "raw": "\"Shake Your Love\" — Debbie Gibson"
    },
    "sides": [
      {
        "queens": [
          "jujubee"
        ]
      },
      {
        "queens": [
          "pandora"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jujubee"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "pandora"
        ]
      }
    ],
    "notes": "Pandora's gut-punch exit",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_2",
      "revision": 1348152014,
      "sha256": "d89c3110275a8e3e289fbc33fb2100892903ec2b74a30d679180edc004d61229",
      "fetchedAt": "2026-04-21T22:37:27.999Z",
      "quote": "Ep 8: Jujubee vs. Pandora Boxx — \"Shake Your Love\" (Debbie Gibson)"
    }
  },
  {
    "id": "s02-e09-1",
    "seasonId": "s02",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Something He Can Feel",
      "artist": "Aretha Franklin",
      "raw": "\"Something He Can Feel\" — Aretha Franklin"
    },
    "sides": [
      {
        "queens": [
          "jujubee"
        ]
      },
      {
        "queens": [
          "tatianna"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jujubee"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "tatianna"
        ]
      }
    ],
    "notes": "Iconic fierce battle",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_2",
      "revision": 1348152014,
      "sha256": "d89c3110275a8e3e289fbc33fb2100892903ec2b74a30d679180edc004d61229",
      "fetchedAt": "2026-04-21T22:37:27.999Z",
      "quote": "Ep 9: Jujubee vs. Tatianna — \"Something He Can Feel\" (Aretha Franklin)"
    }
  },
  {
    "id": "s02-e11-1",
    "seasonId": "s02",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Jealous of My Boogie (Gomi and RasJek Edit)",
      "artist": "RuPaul",
      "raw": "\"Jealous of My Boogie\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "raven"
        ]
      },
      {
        "queens": [
          "tyra"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "tyra"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "raven"
        ]
      }
    ],
    "notes": "Finale, Tyra crowned",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_2",
      "revision": 1348152014,
      "sha256": "d89c3110275a8e3e289fbc33fb2100892903ec2b74a30d679180edc004d61229",
      "fetchedAt": "2026-04-21T22:37:27.999Z",
      "quote": "Ep 11: Raven vs. Tyra Sanchez — \"Jealous of My Boogie (Gomi and RasJek Edit)\" (RuPaul)"
    }
  },
  {
    "id": "s03-e02-1",
    "seasonId": "s03",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "The Right Stuff",
      "artist": "Vanessa Williams",
      "raw": "\"The Right Stuff\" — Vanessa Williams"
    },
    "sides": [
      {
        "queens": [
          "shangela"
        ]
      },
      {
        "queens": [
          "venus"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shangela"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "venus"
        ]
      }
    ],
    "notes": "Shangela's surprise return",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3",
      "revision": 1342629937,
      "sha256": "f688371c95ba980375dd7b99cfd2f028a0c8e32196f8400e21d06416588c0e25",
      "fetchedAt": "2026-04-21T22:37:28.529Z",
      "quote": "Ep 2: Shangela vs. Venus D-Lite — \"The Right Stuff\" (Vanessa Williams)"
    }
  },
  {
    "id": "s03-e03-1",
    "seasonId": "s03",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Bad Romance",
      "artist": "Lady Gaga",
      "raw": "\"Bad Romance\" — Lady Gaga"
    },
    "sides": [
      {
        "queens": [
          "delta"
        ]
      },
      {
        "queens": [
          "phoenix"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "delta"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "phoenix"
        ]
      }
    ],
    "notes": "Phoenix first out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3",
      "revision": 1342629937,
      "sha256": "f688371c95ba980375dd7b99cfd2f028a0c8e32196f8400e21d06416588c0e25",
      "fetchedAt": "2026-04-21T22:37:28.529Z",
      "quote": "Ep 3: Delta Work vs. Phoenix — \"Bad Romance\" (Lady Gaga)"
    }
  },
  {
    "id": "s03-e04-1",
    "seasonId": "s03",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Don't Leave Me This Way",
      "artist": "Thelma Houston",
      "raw": "\"Don't Leave Me This Way\" — Thelma Houston"
    },
    "sides": [
      {
        "queens": [
          "india"
        ]
      },
      {
        "queens": [
          "mimi"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "india"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mimi"
        ]
      }
    ],
    "notes": "Mimi's infamous pickup",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3",
      "revision": 1342629937,
      "sha256": "f688371c95ba980375dd7b99cfd2f028a0c8e32196f8400e21d06416588c0e25",
      "fetchedAt": "2026-04-21T22:37:28.529Z",
      "quote": "Ep 4: India Ferrah vs. Mimi Imfurst — \"Don't Leave Me This Way\" (Thelma Houston)"
    }
  },
  {
    "id": "s03-e05-1",
    "seasonId": "s03",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Meeting in the Ladies Room",
      "artist": "Klymaxx",
      "raw": "\"Meeting in the Ladies Room\" — Klymaxx"
    },
    "sides": [
      {
        "queens": [
          "india"
        ]
      },
      {
        "queens": [
          "stacy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "stacy"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "india"
        ]
      }
    ],
    "notes": "India's messy exit",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3",
      "revision": 1342629937,
      "sha256": "f688371c95ba980375dd7b99cfd2f028a0c8e32196f8400e21d06416588c0e25",
      "fetchedAt": "2026-04-21T22:37:28.529Z",
      "quote": "Ep 5: India Ferrah vs. Stacy Layne Matthews — \"Meeting in the Ladies Room\" (Klymaxx)"
    }
  },
  {
    "id": "s03-e06-1",
    "seasonId": "s03",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Looking for a New Love",
      "artist": "Jody Watley",
      "raw": "\"Looking for a New Love\" — Jody Watley"
    },
    "sides": [
      {
        "queens": [
          "delta"
        ]
      },
      {
        "queens": [
          "mariah"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "delta"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mariah"
        ]
      }
    ],
    "notes": "Mariah sashays quietly",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3",
      "revision": 1342629937,
      "sha256": "f688371c95ba980375dd7b99cfd2f028a0c8e32196f8400e21d06416588c0e25",
      "fetchedAt": "2026-04-21T22:37:28.529Z",
      "quote": "Ep 6: Delta Work vs. Mariah — \"Looking for a New Love\" (Jody Watley)"
    }
  },
  {
    "id": "s03-e07-1",
    "seasonId": "s03",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Knock on Wood",
      "artist": "Amii Stewart",
      "raw": "\"Knock on Wood\" — Amii Stewart"
    },
    "sides": [
      {
        "queens": [
          "alexis_mateo"
        ]
      },
      {
        "queens": [
          "stacy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alexis_mateo"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "stacy"
        ]
      }
    ],
    "notes": "Stacy's gentle goodbye",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3",
      "revision": 1342629937,
      "sha256": "f688371c95ba980375dd7b99cfd2f028a0c8e32196f8400e21d06416588c0e25",
      "fetchedAt": "2026-04-21T22:37:28.529Z",
      "quote": "Ep 7: Alexis Mateo vs. Stacy Layne Matthews — \"Knock on Wood\" (Amii Stewart)"
    }
  },
  {
    "id": "s03-e08-1",
    "seasonId": "s03",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "MacArthur Park",
      "artist": "Donna Summer",
      "raw": "\"MacArthur Park\" — Donna Summer"
    },
    "sides": [
      {
        "queens": [
          "delta"
        ]
      },
      {
        "queens": [
          "manila"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "manila"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "delta"
        ]
      }
    ],
    "notes": "Delta sashays at last",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3",
      "revision": 1342629937,
      "sha256": "f688371c95ba980375dd7b99cfd2f028a0c8e32196f8400e21d06416588c0e25",
      "fetchedAt": "2026-04-21T22:37:28.529Z",
      "quote": "Ep 8: Delta Work vs. Manila Luzon — \"MacArthur Park\" (Donna Summer)"
    }
  },
  {
    "id": "s03-e09-1",
    "seasonId": "s03",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "double_shantay",
    "song": {
      "title": "Mickey (Spanish version)",
      "artist": "Toni Basil",
      "raw": "\"Mickey (Spanish version)\" — Toni Basil"
    },
    "sides": [
      {
        "queens": [
          "carmen"
        ]
      },
      {
        "queens": [
          "yara"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "carmen"
        ]
      },
      {
        "queens": [
          "yara"
        ]
      }
    ],
    "eliminated": [],
    "notes": "First ever double shantay",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3",
      "revision": 1342629937,
      "sha256": "f688371c95ba980375dd7b99cfd2f028a0c8e32196f8400e21d06416588c0e25",
      "fetchedAt": "2026-04-21T22:37:28.529Z",
      "quote": "Ep 9: Carmen Carrera vs. Yara Sofia — \"Mickey (Spanish version)\" (Toni Basil)"
    }
  },
  {
    "id": "s03-e10-1",
    "seasonId": "s03",
    "episode": 10,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Believe",
      "artist": "Cher",
      "raw": "\"Believe\" — Cher"
    },
    "sides": [
      {
        "queens": [
          "carmen"
        ]
      },
      {
        "queens": [
          "shangela"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shangela"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "carmen"
        ]
      }
    ],
    "notes": "Carmen eliminated first time",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3",
      "revision": 1342629937,
      "sha256": "f688371c95ba980375dd7b99cfd2f028a0c8e32196f8400e21d06416588c0e25",
      "fetchedAt": "2026-04-21T22:37:28.529Z",
      "quote": "Ep 10: Carmen Carrera vs. Shangela — \"Believe\" (Cher)"
    }
  },
  {
    "id": "s03-e11-1",
    "seasonId": "s03",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Even Angels",
      "artist": "Fantasia",
      "raw": "\"Even Angels\" — Fantasia"
    },
    "sides": [
      {
        "queens": [
          "alexis_mateo"
        ]
      },
      {
        "queens": [
          "shangela"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alexis_mateo"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "shangela"
        ]
      }
    ],
    "notes": "Shangela's halleloo exit",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3",
      "revision": 1342629937,
      "sha256": "f688371c95ba980375dd7b99cfd2f028a0c8e32196f8400e21d06416588c0e25",
      "fetchedAt": "2026-04-21T22:37:28.529Z",
      "quote": "Ep 11: Alexis Mateo vs. Shangela — \"Even Angels\" (Fantasia)"
    }
  },
  {
    "id": "s03-e12-1",
    "seasonId": "s03",
    "episode": 12,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Straight Up",
      "artist": "Paula Abdul",
      "raw": "\"Straight Up\" — Paula Abdul"
    },
    "sides": [
      {
        "queens": [
          "carmen"
        ]
      },
      {
        "queens": [
          "raja"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "raja"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "carmen"
        ]
      }
    ],
    "notes": "Carmen returns, re-eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3",
      "revision": 1342629937,
      "sha256": "f688371c95ba980375dd7b99cfd2f028a0c8e32196f8400e21d06416588c0e25",
      "fetchedAt": "2026-04-21T22:37:28.529Z",
      "quote": "Ep 12: Carmen Carrera vs. Raja — \"Straight Up\" (Paula Abdul)"
    }
  },
  {
    "id": "s03-e13-1",
    "seasonId": "s03",
    "episode": 13,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "I Think About You",
      "artist": "Patti LaBelle",
      "raw": "\"I Think About You\" — Patti LaBelle"
    },
    "sides": [
      {
        "queens": [
          "alexis_mateo"
        ]
      },
      {
        "queens": [
          "yara"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alexis_mateo"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "yara"
        ]
      }
    ],
    "notes": "Yara's emotional collapse",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3",
      "revision": 1342629937,
      "sha256": "f688371c95ba980375dd7b99cfd2f028a0c8e32196f8400e21d06416588c0e25",
      "fetchedAt": "2026-04-21T22:37:28.529Z",
      "quote": "Ep 13: Alexis Mateo vs. Yara Sofia — \"I Think About You\" (Patti LaBelle)"
    }
  },
  {
    "id": "s03-e15-1",
    "seasonId": "s03",
    "episode": 15,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Champion (DJ BunJoe's Olympic Mix)",
      "artist": "RuPaul",
      "raw": "\"Champion (DJ BunJoe's Olympic Mix)\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "manila"
        ]
      },
      {
        "queens": [
          "raja"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "raja"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "manila"
        ]
      }
    ],
    "notes": "Finale, Raja crowned",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_3",
      "revision": 1342629937,
      "sha256": "f688371c95ba980375dd7b99cfd2f028a0c8e32196f8400e21d06416588c0e25",
      "fetchedAt": "2026-04-21T22:37:28.529Z",
      "quote": "Ep 15: Manila Luzon vs. Raja — \"Champion (DJ BunJoe's Olympic Mix)\" (RuPaul)"
    }
  },
  {
    "id": "s04-e01-1",
    "seasonId": "s04",
    "episode": 1,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Toxic",
      "artist": "Britney Spears",
      "raw": "\"Toxic\" — Britney Spears"
    },
    "sides": [
      {
        "queens": [
          "alisa"
        ]
      },
      {
        "queens": [
          "jiggly"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jiggly"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "alisa"
        ]
      }
    ],
    "notes": "first boot, unremarkable",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_4",
      "revision": 1338507859,
      "sha256": "c043d5fccb6a95371a33334e78b0256ab2866c53747bd9ee37db6ad7731415d3",
      "fetchedAt": "2026-04-21T22:37:29.051Z",
      "quote": "Ep 1: Alisa Summers vs. Jiggly Caliente — \"Toxic\" (Britney Spears)"
    }
  },
  {
    "id": "s04-e02-1",
    "seasonId": "s04",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Bad Girls",
      "artist": "Donna Summer",
      "raw": "\"Bad Girls\" — Donna Summer"
    },
    "sides": [
      {
        "queens": [
          "lashauwn"
        ]
      },
      {
        "queens": [
          "the_princess"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "the_princess"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "lashauwn"
        ]
      }
    ],
    "notes": "\"this is not RuPaul's Best Friend Race\"",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_4",
      "revision": 1338507859,
      "sha256": "c043d5fccb6a95371a33334e78b0256ab2866c53747bd9ee37db6ad7731415d3",
      "fetchedAt": "2026-04-21T22:37:29.051Z",
      "quote": "Ep 2: Lashauwn Beyond vs. The Princess — \"Bad Girls\" (Donna Summer)"
    }
  },
  {
    "id": "s04-e03-1",
    "seasonId": "s04",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "This Will Be (An Everlasting Love)",
      "artist": "Natalie Cole",
      "raw": "\"This Will Be (An Everlasting Love)\" — Natalie Cole"
    },
    "sides": [
      {
        "queens": [
          "dida"
        ]
      },
      {
        "queens": [
          "the_princess"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "dida"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "the_princess"
        ]
      }
    ],
    "notes": "iconic DiDa blowout",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_4",
      "revision": 1338507859,
      "sha256": "c043d5fccb6a95371a33334e78b0256ab2866c53747bd9ee37db6ad7731415d3",
      "fetchedAt": "2026-04-21T22:37:29.051Z",
      "quote": "Ep 3: DiDa Ritz vs. The Princess — \"This Will Be (An Everlasting Love)\" (Natalie Cole)"
    }
  },
  {
    "id": "s04-e04-1",
    "seasonId": "s04",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Trouble",
      "artist": "Pink",
      "raw": "\"Trouble\" — Pink"
    },
    "sides": [
      {
        "queens": [
          "madame"
        ]
      },
      {
        "queens": [
          "milan"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "milan"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "madame"
        ]
      }
    ],
    "notes": "solid first Milan win",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_4",
      "revision": 1338507859,
      "sha256": "c043d5fccb6a95371a33334e78b0256ab2866c53747bd9ee37db6ad7731415d3",
      "fetchedAt": "2026-04-21T22:37:29.051Z",
      "quote": "Ep 4: Madame LaQueer vs. Milan — \"Trouble\" (Pink)"
    }
  },
  {
    "id": "s04-e05-1",
    "seasonId": "s04",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Vogue",
      "artist": "Madonna",
      "raw": "\"Vogue\" — Madonna"
    },
    "sides": [
      {
        "queens": [
          "kenya"
        ]
      },
      {
        "queens": [
          "milan"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "milan"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kenya"
        ]
      }
    ],
    "notes": "Kenya voted back later",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_4",
      "revision": 1338507859,
      "sha256": "c043d5fccb6a95371a33334e78b0256ab2866c53747bd9ee37db6ad7731415d3",
      "fetchedAt": "2026-04-21T22:37:29.051Z",
      "quote": "Ep 5: Kenya Michaels vs. Milan — \"Vogue\" (Madonna)"
    }
  },
  {
    "id": "s04-e06-1",
    "seasonId": "s04",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Born This Way",
      "artist": "Lady Gaga",
      "raw": "\"Born This Way\" — Lady Gaga"
    },
    "sides": [
      {
        "queens": [
          "jiggly"
        ]
      },
      {
        "queens": [
          "milan"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jiggly"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "milan"
        ]
      }
    ],
    "notes": "Milan sent home",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_4",
      "revision": 1338507859,
      "sha256": "c043d5fccb6a95371a33334e78b0256ab2866c53747bd9ee37db6ad7731415d3",
      "fetchedAt": "2026-04-21T22:37:29.051Z",
      "quote": "Ep 6: Jiggly Caliente vs. Milan — \"Born This Way\" (Lady Gaga)"
    }
  },
  {
    "id": "s04-e07-1",
    "seasonId": "s04",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Mi Vida Loca (My Crazy Life)",
      "artist": "Pam Tillis",
      "raw": "\"Mi Vida Loca\" — Pam Tillis"
    },
    "sides": [
      {
        "queens": [
          "jiggly"
        ]
      },
      {
        "queens": [
          "willam"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "willam"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jiggly"
        ]
      }
    ],
    "notes": "Willam's last before DQ",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_4",
      "revision": 1338507859,
      "sha256": "c043d5fccb6a95371a33334e78b0256ab2866c53747bd9ee37db6ad7731415d3",
      "fetchedAt": "2026-04-21T22:37:29.051Z",
      "quote": "Ep 7: Jiggly Caliente vs. Willam — \"Mi Vida Loca (My Crazy Life)\" (Pam Tillis)"
    }
  },
  {
    "id": "s04-e08-1",
    "seasonId": "s04",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "double_shantay",
    "song": {
      "title": "It's Raining Men... The Sequel",
      "artist": "Martha Wash and RuPaul",
      "raw": "\"It's Raining Men (The Sequel)\" — Martha Wash & RuPaul"
    },
    "sides": [
      {
        "queens": [
          "phiphi"
        ]
      },
      {
        "queens": [
          "sharon"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "phiphi"
        ]
      },
      {
        "queens": [
          "sharon"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Willam disqualified post-LSFYL",
    "verified": true,
    "flags": [
      "disqualified_post_ls",
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_4",
      "revision": 1338507859,
      "sha256": "c043d5fccb6a95371a33334e78b0256ab2866c53747bd9ee37db6ad7731415d3",
      "fetchedAt": "2026-04-21T22:37:29.051Z",
      "quote": "Ep 8: Phi Phi O'Hara vs. Sharon Needles — \"It's Raining Men... The Sequel\" (Martha Wash and RuPaul)"
    }
  },
  {
    "id": "s04-e09-1",
    "seasonId": "s04",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "I've Got to Use My Imagination",
      "artist": "Gladys Knight & the Pips",
      "raw": "\"I've Got to Use My Imagination\" — Gladys Knight & the Pips"
    },
    "sides": [
      {
        "queens": [
          "dida"
        ]
      },
      {
        "queens": [
          "latrice"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "latrice"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "dida"
        ]
      }
    ],
    "notes": "DiDa returning, still boot",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_4",
      "revision": 1338507859,
      "sha256": "c043d5fccb6a95371a33334e78b0256ab2866c53747bd9ee37db6ad7731415d3",
      "fetchedAt": "2026-04-21T22:37:29.051Z",
      "quote": "Ep 9: DiDa Ritz vs. Latrice Royale — \"I've Got to Use My Imagination\" (Gladys Knight & the Pips)"
    }
  },
  {
    "id": "s04-e10-1",
    "seasonId": "s04",
    "episode": 10,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "(You Make Me Feel Like) A Natural Woman",
      "artist": "Aretha Franklin",
      "raw": "\"(You Make Me Feel Like) A Natural Woman\" — Aretha Franklin"
    },
    "sides": [
      {
        "queens": [
          "kenya"
        ]
      },
      {
        "queens": [
          "latrice"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "latrice"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kenya"
        ]
      }
    ],
    "notes": "Kenya out for good",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_4",
      "revision": 1338507859,
      "sha256": "c043d5fccb6a95371a33334e78b0256ab2866c53747bd9ee37db6ad7731415d3",
      "fetchedAt": "2026-04-21T22:37:29.051Z",
      "quote": "Ep 10: Kenya Michaels vs. Latrice Royale — \"(You Make Me Feel Like) A Natural Woman\" (Aretha Franklin)"
    }
  },
  {
    "id": "s04-e11-1",
    "seasonId": "s04",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "No One Else on Earth",
      "artist": "Wynonna Judd",
      "raw": "\"No One Else on Earth\" — Wynonna Judd"
    },
    "sides": [
      {
        "queens": [
          "chad"
        ]
      },
      {
        "queens": [
          "latrice"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "chad"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "latrice"
        ]
      }
    ],
    "notes": "emotional Latrice exit",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_4",
      "revision": 1338507859,
      "sha256": "c043d5fccb6a95371a33334e78b0256ab2866c53747bd9ee37db6ad7731415d3",
      "fetchedAt": "2026-04-21T22:37:29.051Z",
      "quote": "Ep 11: Chad Michaels vs. Latrice Royale — \"No One Else on Earth\" (Wynonna Judd)"
    }
  },
  {
    "id": "s05-e01-1",
    "seasonId": "s05",
    "episode": 1,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Party in the U.S.A.",
      "artist": "Miley Cyrus",
      "raw": "\"Party in the U.S.A.\" — Miley Cyrus"
    },
    "sides": [
      {
        "queens": [
          "penny"
        ]
      },
      {
        "queens": [
          "serena"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "serena"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "penny"
        ]
      }
    ],
    "notes": "first boot, tepid",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_5",
      "revision": 1340926879,
      "sha256": "d9448efb3cb53e315df236d047a9b6eab3692c793180bc4f3c348593258ac317",
      "fetchedAt": "2026-04-21T22:37:29.571Z",
      "quote": "Ep 1: Penny Tration vs. Serena ChaCha — \"Party in the U.S.A.\" (Miley Cyrus)"
    }
  },
  {
    "id": "s05-e02-1",
    "seasonId": "s05",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Only Girl (In the World)",
      "artist": "Rihanna",
      "raw": "\"Only Girl (In the World)\" — Rihanna"
    },
    "sides": [
      {
        "queens": [
          "monica"
        ]
      },
      {
        "queens": [
          "serena"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "monica"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "serena"
        ]
      }
    ],
    "notes": "Monica came out as trans pre-LSFYL",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_5",
      "revision": 1340926879,
      "sha256": "d9448efb3cb53e315df236d047a9b6eab3692c793180bc4f3c348593258ac317",
      "fetchedAt": "2026-04-21T22:37:29.571Z",
      "quote": "Ep 2: Monica Beverly Hillz vs. Serena ChaCha — \"Only Girl (In the World)\" (Rihanna)"
    }
  },
  {
    "id": "s05-e03-1",
    "seasonId": "s05",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "When I Grow Up",
      "artist": "The Pussycat Dolls",
      "raw": "\"When I Grow Up\" — The Pussycat Dolls"
    },
    "sides": [
      {
        "queens": [
          "coco"
        ]
      },
      {
        "queens": [
          "monica"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "coco"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "monica"
        ]
      }
    ],
    "notes": "Coco's first LSFYL win",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_5",
      "revision": 1340926879,
      "sha256": "d9448efb3cb53e315df236d047a9b6eab3692c793180bc4f3c348593258ac317",
      "fetchedAt": "2026-04-21T22:37:29.571Z",
      "quote": "Ep 3: Coco Montrese vs. Monica Beverly Hillz — \"When I Grow Up\" (The Pussycat Dolls)"
    }
  },
  {
    "id": "s05-e04-1",
    "seasonId": "s05",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "double_sashay",
    "song": {
      "title": "Oops!... I Did It Again",
      "artist": "Britney Spears",
      "raw": "\"Oops!... I Did It Again\" — Britney Spears"
    },
    "sides": [
      {
        "queens": [
          "honey"
        ]
      },
      {
        "queens": [
          "vivienne"
        ]
      }
    ],
    "winners": [],
    "eliminated": [
      {
        "queens": [
          "honey"
        ]
      },
      {
        "queens": [
          "vivienne"
        ]
      }
    ],
    "notes": "first-ever double sashay",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_5",
      "revision": 1340926879,
      "sha256": "d9448efb3cb53e315df236d047a9b6eab3692c793180bc4f3c348593258ac317",
      "fetchedAt": "2026-04-21T22:37:29.571Z",
      "quote": "Ep 4: Honey Mahogany vs. Vivienne Pinay — \"Oops!... I Did It Again\" (Britney Spears)"
    }
  },
  {
    "id": "s05-e05-1",
    "seasonId": "s05",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Take Me Home",
      "artist": "Cher",
      "raw": "\"Take Me Home\" — Cher"
    },
    "sides": [
      {
        "queens": [
          "detox"
        ]
      },
      {
        "queens": [
          "lineysha"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "detox"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "lineysha"
        ]
      }
    ],
    "notes": "underwhelming",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_5",
      "revision": 1340926879,
      "sha256": "d9448efb3cb53e315df236d047a9b6eab3692c793180bc4f3c348593258ac317",
      "fetchedAt": "2026-04-21T22:37:29.571Z",
      "quote": "Ep 5: Detox vs. Lineysha Sparx — \"Take Me Home\" (Cher)"
    }
  },
  {
    "id": "s05-e06-1",
    "seasonId": "s05",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "I'm So Excited",
      "artist": "The Pointer Sisters",
      "raw": "\"I'm So Excited\" — The Pointer Sisters"
    },
    "sides": [
      {
        "queens": [
          "coco"
        ]
      },
      {
        "queens": [
          "jade_jolie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "coco"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jade_jolie"
        ]
      }
    ],
    "notes": "solid, uneventful",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_5",
      "revision": 1340926879,
      "sha256": "d9448efb3cb53e315df236d047a9b6eab3692c793180bc4f3c348593258ac317",
      "fetchedAt": "2026-04-21T22:37:29.571Z",
      "quote": "Ep 6: Coco Montrese vs. Jade Jolie — \"I'm So Excited\" (The Pointer Sisters)"
    }
  },
  {
    "id": "s05-e07-1",
    "seasonId": "s05",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "double_shantay",
    "song": {
      "title": "Whip My Hair",
      "artist": "Willow Smith",
      "raw": "\"Whip My Hair\" — Willow Smith"
    },
    "sides": [
      {
        "queens": [
          "alyssa"
        ]
      },
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alyssa"
        ]
      },
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "eliminated": [],
    "notes": "iconic Roxxxy wig-reveal",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_5",
      "revision": 1340926879,
      "sha256": "d9448efb3cb53e315df236d047a9b6eab3692c793180bc4f3c348593258ac317",
      "fetchedAt": "2026-04-21T22:37:29.571Z",
      "quote": "Ep 7: Alyssa Edwards vs. Roxxxy Andrews — \"Whip My Hair\" (Willow Smith)"
    }
  },
  {
    "id": "s05-e08-1",
    "seasonId": "s05",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Ain't Nothin' Goin' On but the Rent",
      "artist": "Gwen Guthrie",
      "raw": "\"Ain't Nothin' Goin' on But the Rent\" — Gwen Guthrie"
    },
    "sides": [
      {
        "queens": [
          "alyssa"
        ]
      },
      {
        "queens": [
          "ivy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alyssa"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "ivy"
        ]
      }
    ],
    "notes": "Alyssa rocket tits",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_5",
      "revision": 1340926879,
      "sha256": "d9448efb3cb53e315df236d047a9b6eab3692c793180bc4f3c348593258ac317",
      "fetchedAt": "2026-04-21T22:37:29.571Z",
      "quote": "Ep 8: Alyssa Edwards vs. Ivy Winters — \"Ain't Nothin' Goin' On but the Rent\" (Gwen Guthrie)"
    }
  },
  {
    "id": "s05-e09-1",
    "seasonId": "s05",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Cold Hearted",
      "artist": "Paula Abdul",
      "raw": "\"Cold Hearted\" — Paula Abdul"
    },
    "sides": [
      {
        "queens": [
          "alyssa"
        ]
      },
      {
        "queens": [
          "coco"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "coco"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "alyssa"
        ]
      }
    ],
    "notes": "Alyssa-Coco pageant rivalry cliff",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_5",
      "revision": 1340926879,
      "sha256": "d9448efb3cb53e315df236d047a9b6eab3692c793180bc4f3c348593258ac317",
      "fetchedAt": "2026-04-21T22:37:29.571Z",
      "quote": "Ep 9: Alyssa Edwards vs. Coco Montrese — \"Cold Hearted\" (Paula Abdul)"
    }
  },
  {
    "id": "s05-e10-1",
    "seasonId": "s05",
    "episode": 10,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Two to Make It Right",
      "artist": "Seduction",
      "raw": "\"(It Takes) Two to Make It Right\" — Seduction"
    },
    "sides": [
      {
        "queens": [
          "coco"
        ]
      },
      {
        "queens": [
          "detox"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "detox"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "coco"
        ]
      }
    ],
    "notes": "Coco finally out",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_5",
      "revision": 1340926879,
      "sha256": "d9448efb3cb53e315df236d047a9b6eab3692c793180bc4f3c348593258ac317",
      "fetchedAt": "2026-04-21T22:37:29.571Z",
      "quote": "Ep 10: Coco Montrese vs. Detox — \"Two to Make It Right\" (Seduction)"
    }
  },
  {
    "id": "s05-e11-1",
    "seasonId": "s05",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Malambo No. 1",
      "artist": "Yma Sumac",
      "raw": "\"Malambo No. 1\" — Yma Sumac"
    },
    "sides": [
      {
        "queens": [
          "detox"
        ]
      },
      {
        "queens": [
          "jinkx"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jinkx"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "detox"
        ]
      }
    ],
    "notes": "unexpected Jinkx snap-out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_5",
      "revision": 1340926879,
      "sha256": "d9448efb3cb53e315df236d047a9b6eab3692c793180bc4f3c348593258ac317",
      "fetchedAt": "2026-04-21T22:37:29.571Z",
      "quote": "Ep 11: Detox vs. Jinkx Monsoon — \"Malambo No. 1\" (Yma Sumac)"
    }
  },
  {
    "id": "s06-e01-1",
    "seasonId": "s06",
    "episode": 1,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Express Yourself",
      "artist": "Madonna",
      "raw": "\"Express Yourself\" — Madonna"
    },
    "sides": [
      {
        "queens": [
          "kelly"
        ]
      },
      {
        "queens": [
          "vivacious"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "vivacious"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kelly"
        ]
      }
    ],
    "notes": "split premiere, first boot",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_6",
      "revision": 1334492342,
      "sha256": "8fe7c1dbc9b331614b954a63300ca9f3d018d62641d915aa20dba7a0a86e2a43",
      "fetchedAt": "2026-04-21T22:37:30.118Z",
      "quote": "Ep 1: Kelly Mantle vs. Vivacious — \"Express Yourself\" (Madonna)"
    }
  },
  {
    "id": "s06-e02-1",
    "seasonId": "s06",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Turn the Beat Around",
      "artist": "Vicki Sue Robinson",
      "raw": "\"Turn the Beat Around\" — Vicki Sue Robinson"
    },
    "sides": [
      {
        "queens": [
          "darienne"
        ]
      },
      {
        "queens": [
          "magnolia"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "darienne"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "magnolia"
        ]
      }
    ],
    "notes": "other-half premiere boot",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_6",
      "revision": 1334492342,
      "sha256": "8fe7c1dbc9b331614b954a63300ca9f3d018d62641d915aa20dba7a0a86e2a43",
      "fetchedAt": "2026-04-21T22:37:30.118Z",
      "quote": "Ep 2: Darienne Lake vs. Magnolia Crawford — \"Turn the Beat Around\" (Vicki Sue Robinson)"
    }
  },
  {
    "id": "s06-e03-1",
    "seasonId": "s06",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Shake It Up",
      "artist": "Selena Gomez",
      "raw": "\"Shake It Up\" — Selena Gomez"
    },
    "sides": [
      {
        "queens": [
          "april"
        ]
      },
      {
        "queens": [
          "vivacious"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "april"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "vivacious"
        ]
      }
    ],
    "notes": "Ornacia drops off head",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_6",
      "revision": 1334492342,
      "sha256": "8fe7c1dbc9b331614b954a63300ca9f3d018d62641d915aa20dba7a0a86e2a43",
      "fetchedAt": "2026-04-21T22:37:30.118Z",
      "quote": "Ep 3: April Carrión vs. Vivacious — \"Shake It Up\" (Selena Gomez)"
    }
  },
  {
    "id": "s06-e04-1",
    "seasonId": "s06",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "I'm Every Woman",
      "artist": "Chaka Khan",
      "raw": "\"I'm Every Woman\" — Chaka Khan"
    },
    "sides": [
      {
        "queens": [
          "april"
        ]
      },
      {
        "queens": [
          "trinity_bonet"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "trinity_bonet"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "april"
        ]
      }
    ],
    "notes": "Trinity stunt kicks",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_6",
      "revision": 1334492342,
      "sha256": "8fe7c1dbc9b331614b954a63300ca9f3d018d62641d915aa20dba7a0a86e2a43",
      "fetchedAt": "2026-04-21T22:37:30.118Z",
      "quote": "Ep 4: April Carrión vs. Trinity K. Bonet — \"I'm Every Woman\" (Chaka Khan)"
    }
  },
  {
    "id": "s06-e05-1",
    "seasonId": "s06",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Head to Toe",
      "artist": "Lisa Lisa and Cult Jam",
      "raw": "\"Head to Toe\" — Lisa Lisa & Cult Jam"
    },
    "sides": [
      {
        "queens": [
          "gia"
        ]
      },
      {
        "queens": [
          "laganja"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "laganja"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "gia"
        ]
      }
    ],
    "notes": "Laganja dramatic splits",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_6",
      "revision": 1334492342,
      "sha256": "8fe7c1dbc9b331614b954a63300ca9f3d018d62641d915aa20dba7a0a86e2a43",
      "fetchedAt": "2026-04-21T22:37:30.118Z",
      "quote": "Ep 5: Gia Gunn vs. Laganja Estranja — \"Head to Toe\" (Lisa Lisa and Cult Jam)"
    }
  },
  {
    "id": "s06-e06-1",
    "seasonId": "s06",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Whatta Man",
      "artist": "Salt-n-Pepa, En Vogue",
      "raw": "\"Whatta Man\" — Salt-n-Pepa with En Vogue"
    },
    "sides": [
      {
        "queens": [
          "milk"
        ]
      },
      {
        "queens": [
          "trinity_bonet"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "trinity_bonet"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "milk"
        ]
      }
    ],
    "notes": "Milk's odd choice sends her home",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_6",
      "revision": 1334492342,
      "sha256": "8fe7c1dbc9b331614b954a63300ca9f3d018d62641d915aa20dba7a0a86e2a43",
      "fetchedAt": "2026-04-21T22:37:30.118Z",
      "quote": "Ep 6: Milk vs. Trinity K. Bonet — \"Whatta Man\" (Salt-n-Pepa, En Vogue)"
    }
  },
  {
    "id": "s06-e07-1",
    "seasonId": "s06",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Point of No Return",
      "artist": "Exposé",
      "raw": "\"Point of No Return\" — Exposé"
    },
    "sides": [
      {
        "queens": [
          "bendela"
        ]
      },
      {
        "queens": [
          "darienne"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "darienne"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Ben saved despite losing",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_6",
      "revision": 1334492342,
      "sha256": "8fe7c1dbc9b331614b954a63300ca9f3d018d62641d915aa20dba7a0a86e2a43",
      "fetchedAt": "2026-04-21T22:37:30.118Z",
      "quote": "Ep 7: BenDeLaCreme vs. Darienne Lake — \"Point of No Return\" (Exposé)"
    }
  },
  {
    "id": "s06-e08-1",
    "seasonId": "s06",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Stupid Girls",
      "artist": "Pink",
      "raw": "\"Stupid Girls\" — Pink"
    },
    "sides": [
      {
        "queens": [
          "joslyn"
        ]
      },
      {
        "queens": [
          "laganja"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "joslyn"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "laganja"
        ]
      }
    ],
    "notes": "Laganja finally out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_6",
      "revision": 1334492342,
      "sha256": "8fe7c1dbc9b331614b954a63300ca9f3d018d62641d915aa20dba7a0a86e2a43",
      "fetchedAt": "2026-04-21T22:37:30.118Z",
      "quote": "Ep 8: Joslyn Fox vs. Laganja Estranja — \"Stupid Girls\" (Pink)"
    }
  },
  {
    "id": "s06-e09-1",
    "seasonId": "s06",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Vibeology",
      "artist": "Paula Abdul",
      "raw": "\"Vibeology\" — Paula Abdul"
    },
    "sides": [
      {
        "queens": [
          "adore"
        ]
      },
      {
        "queens": [
          "trinity_bonet"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "adore"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "trinity_bonet"
        ]
      }
    ],
    "notes": "Adore snaps into gear",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_6",
      "revision": 1334492342,
      "sha256": "8fe7c1dbc9b331614b954a63300ca9f3d018d62641d915aa20dba7a0a86e2a43",
      "fetchedAt": "2026-04-21T22:37:30.118Z",
      "quote": "Ep 9: Adore Delano vs. Trinity K. Bonet — \"Vibeology\" (Paula Abdul)"
    }
  },
  {
    "id": "s06-e10-1",
    "seasonId": "s06",
    "episode": 10,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Think",
      "artist": "Aretha Franklin",
      "raw": "\"Think\" — Aretha Franklin"
    },
    "sides": [
      {
        "queens": [
          "adore"
        ]
      },
      {
        "queens": [
          "joslyn"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "adore"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "joslyn"
        ]
      }
    ],
    "notes": "Joslyn valiant underdog",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_6",
      "revision": 1334492342,
      "sha256": "8fe7c1dbc9b331614b954a63300ca9f3d018d62641d915aa20dba7a0a86e2a43",
      "fetchedAt": "2026-04-21T22:37:30.118Z",
      "quote": "Ep 10: Adore Delano vs. Joslyn Fox — \"Think\" (Aretha Franklin)"
    }
  },
  {
    "id": "s06-e11-1",
    "seasonId": "s06",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Stronger (What Doesn't Kill You)",
      "artist": "Kelly Clarkson",
      "raw": "\"Stronger (What Doesn't Kill You)\" — Kelly Clarkson"
    },
    "sides": [
      {
        "queens": [
          "bendela"
        ]
      },
      {
        "queens": [
          "darienne"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "darienne"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "bendela"
        ]
      }
    ],
    "notes": "shocking Ben elimination",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_6",
      "revision": 1334492342,
      "sha256": "8fe7c1dbc9b331614b954a63300ca9f3d018d62641d915aa20dba7a0a86e2a43",
      "fetchedAt": "2026-04-21T22:37:30.118Z",
      "quote": "Ep 11: BenDeLaCreme vs. Darienne Lake — \"Stronger (What Doesn't Kill You)\" (Kelly Clarkson)"
    }
  },
  {
    "id": "s07-e01-1",
    "seasonId": "s07",
    "episode": 1,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Geronimo",
      "artist": "RuPaul ft. Lucian Piane",
      "raw": "\"Geronimo\" — RuPaul ft. Lucian Piane"
    },
    "sides": [
      {
        "queens": [
          "kandy_ho"
        ]
      },
      {
        "queens": [
          "tempest"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kandy_ho"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "tempest"
        ]
      }
    ],
    "notes": "first boot, forgettable",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_7",
      "revision": 1333360798,
      "sha256": "edd07b2fb44ee7a7971125a9874bb318a7f54e2e2ae66beb7325b14b27a8c4fb",
      "fetchedAt": "2026-04-21T22:37:30.725Z",
      "quote": "Ep 1: Kandy Ho vs. Tempest DuJour — \"Geronimo\" (RuPaul ft. Lucian Piane)"
    }
  },
  {
    "id": "s07-e02-1",
    "seasonId": "s07",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Twist of Fate",
      "artist": "Olivia Newton-John",
      "raw": "\"Twist of Fate\" — Olivia Newton-John"
    },
    "sides": [
      {
        "queens": [
          "katya"
        ]
      },
      {
        "queens": [
          "sashabelle"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "katya"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "sashabelle"
        ]
      }
    ],
    "notes": "Katya's nervous debut",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_7",
      "revision": 1333360798,
      "sha256": "edd07b2fb44ee7a7971125a9874bb318a7f54e2e2ae66beb7325b14b27a8c4fb",
      "fetchedAt": "2026-04-21T22:37:30.725Z",
      "quote": "Ep 2: Katya vs. Sasha Belle — \"Twist of Fate\" (Olivia Newton-John)"
    }
  },
  {
    "id": "s07-e03-1",
    "seasonId": "s07",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "I Was Gonna Cancel",
      "artist": "Kylie Minogue",
      "raw": "\"I Was Gonna Cancel\" — Kylie Minogue"
    },
    "sides": [
      {
        "queens": [
          "jasminemasters"
        ]
      },
      {
        "queens": [
          "kennedy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kennedy"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jasminemasters"
        ]
      }
    ],
    "notes": "Kennedy splits, Jasmine out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_7",
      "revision": 1333360798,
      "sha256": "edd07b2fb44ee7a7971125a9874bb318a7f54e2e2ae66beb7325b14b27a8c4fb",
      "fetchedAt": "2026-04-21T22:37:30.725Z",
      "quote": "Ep 3: Jasmine Masters vs. Kennedy Davenport — \"I Was Gonna Cancel\" (Kylie Minogue)"
    }
  },
  {
    "id": "s07-e04-1",
    "seasonId": "s07",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Dreaming",
      "artist": "Blondie",
      "raw": "\"Dreaming\" — Blondie"
    },
    "sides": [
      {
        "queens": [
          "pearl"
        ]
      },
      {
        "queens": [
          "trixie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "pearl"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "trixie"
        ]
      }
    ],
    "notes": "Trixie first time out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_7",
      "revision": 1333360798,
      "sha256": "edd07b2fb44ee7a7971125a9874bb318a7f54e2e2ae66beb7325b14b27a8c4fb",
      "fetchedAt": "2026-04-21T22:37:30.725Z",
      "quote": "Ep 4: Pearl vs. Trixie Mattel — \"Dreaming\" (Blondie)"
    }
  },
  {
    "id": "s07-e05-1",
    "seasonId": "s07",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Lovergirl",
      "artist": "Teena Marie",
      "raw": "\"Lovergirl\" — Teena Marie"
    },
    "sides": [
      {
        "queens": [
          "kandy_ho"
        ]
      },
      {
        "queens": [
          "mrskasha"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kandy_ho"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mrskasha"
        ]
      }
    ],
    "notes": "MKD sent home",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_7",
      "revision": 1333360798,
      "sha256": "edd07b2fb44ee7a7971125a9874bb318a7f54e2e2ae66beb7325b14b27a8c4fb",
      "fetchedAt": "2026-04-21T22:37:30.725Z",
      "quote": "Ep 5: Kandy Ho vs. Mrs. Kasha Davis — \"Lovergirl\" (Teena Marie)"
    }
  },
  {
    "id": "s07-e06-1",
    "seasonId": "s07",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Break Free",
      "artist": "Ariana Grande ft. Zedd",
      "raw": "\"Break Free\" — Ariana Grande ft. Zedd"
    },
    "sides": [
      {
        "queens": [
          "jaidynn"
        ]
      },
      {
        "queens": [
          "kandy_ho"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jaidynn"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kandy_ho"
        ]
      }
    ],
    "notes": "Jaidynn upset",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_7",
      "revision": 1333360798,
      "sha256": "edd07b2fb44ee7a7971125a9874bb318a7f54e2e2ae66beb7325b14b27a8c4fb",
      "fetchedAt": "2026-04-21T22:37:30.725Z",
      "quote": "Ep 6: Jaidynn Diore Fierce vs. Kandy Ho — \"Break Free\" (Ariana Grande ft. Zedd)"
    }
  },
  {
    "id": "s07-e07-1",
    "seasonId": "s07",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "No More Lies",
      "artist": "Michel'le",
      "raw": "\"No More Lies\" — Michel'le"
    },
    "sides": [
      {
        "queens": [
          "jaidynn"
        ]
      },
      {
        "queens": [
          "max"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jaidynn"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "max"
        ]
      }
    ],
    "notes": "Max ousted, shock boot",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_7",
      "revision": 1333360798,
      "sha256": "edd07b2fb44ee7a7971125a9874bb318a7f54e2e2ae66beb7325b14b27a8c4fb",
      "fetchedAt": "2026-04-21T22:37:30.725Z",
      "quote": "Ep 7: Jaidynn Diore Fierce vs. Max — \"No More Lies\" (Michel'le)"
    }
  },
  {
    "id": "s07-e08-1",
    "seasonId": "s07",
    "episode": 8,
    "sequence": 1,
    "type": "team",
    "outcome": "single_winner",
    "song": {
      "title": "I Think We're Alone Now",
      "artist": "Tiffany",
      "raw": "\"I Think We're Alone Now\" — Tiffany"
    },
    "sides": [
      {
        "queens": [
          "ginger",
          "sashabelle"
        ]
      },
      {
        "queens": [
          "jaidynn",
          "tempest"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ginger",
          "sashabelle"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jaidynn"
        ]
      }
    ],
    "notes": "team-format LSFYL (\"Conjoined Queens\"); Jaidynn eliminated [Wiki lists only 2 primary lipsyncers; canonical has full 4-queen team structure]",
    "verified": true,
    "flags": [
      "wiki_simplified_participants"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_7",
      "revision": 1333360798,
      "sha256": "edd07b2fb44ee7a7971125a9874bb318a7f54e2e2ae66beb7325b14b27a8c4fb",
      "fetchedAt": "2026-04-21T22:37:30.725Z",
      "quote": "Ep 8: Ginger Minj vs. Jaidynn Diore Fierce — \"I Think We're Alone Now\" (Tiffany)"
    }
  },
  {
    "id": "s07-e09-1",
    "seasonId": "s07",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Really Don't Care",
      "artist": "Demi Lovato ft. Cher Lloyd",
      "raw": "\"Really Don't Care\" — Demi Lovato ft. Cher Lloyd"
    },
    "sides": [
      {
        "queens": [
          "missfame"
        ]
      },
      {
        "queens": [
          "pearl"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "pearl"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "missfame"
        ]
      }
    ],
    "notes": "Pearl fully wakes up",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_7",
      "revision": 1333360798,
      "sha256": "edd07b2fb44ee7a7971125a9874bb318a7f54e2e2ae66beb7325b14b27a8c4fb",
      "fetchedAt": "2026-04-21T22:37:30.725Z",
      "quote": "Ep 9: Miss Fame vs. Pearl — \"Really Don't Care\" (Demi Lovato ft. Cher Lloyd)"
    }
  },
  {
    "id": "s07-e10-1",
    "seasonId": "s07",
    "episode": 10,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Show Me Love",
      "artist": "Robin S.",
      "raw": "\"Show Me Love\" — Robin S."
    },
    "sides": [
      {
        "queens": [
          "ginger"
        ]
      },
      {
        "queens": [
          "trixie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ginger"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "trixie"
        ]
      }
    ],
    "notes": "Trixie's return cut short",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_7",
      "revision": 1333360798,
      "sha256": "edd07b2fb44ee7a7971125a9874bb318a7f54e2e2ae66beb7325b14b27a8c4fb",
      "fetchedAt": "2026-04-21T22:37:30.725Z",
      "quote": "Ep 10: Ginger Minj vs. Trixie Mattel — \"Show Me Love\" (Robin S.)"
    }
  },
  {
    "id": "s07-e11-1",
    "seasonId": "s07",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Roar",
      "artist": "Katy Perry",
      "raw": "\"Roar\" — Katy Perry"
    },
    "sides": [
      {
        "queens": [
          "katya"
        ]
      },
      {
        "queens": [
          "kennedy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kennedy"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "katya"
        ]
      }
    ],
    "notes": "Kennedy splits galore",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_7",
      "revision": 1333360798,
      "sha256": "edd07b2fb44ee7a7971125a9874bb318a7f54e2e2ae66beb7325b14b27a8c4fb",
      "fetchedAt": "2026-04-21T22:37:30.725Z",
      "quote": "Ep 11: Katya vs. Kennedy Davenport — \"Roar\" (Katy Perry)"
    }
  },
  {
    "id": "s07-e12-1",
    "seasonId": "s07",
    "episode": 12,
    "sequence": 1,
    "type": "regular",
    "outcome": "multi_advance",
    "song": {
      "title": "Born Naked",
      "artist": "RuPaul ft. Clairy Browne",
      "raw": "\"Born Naked\" — RuPaul ft. Clairy Browne"
    },
    "sides": [
      {
        "queens": [
          "ginger"
        ]
      },
      {
        "queens": [
          "kennedy"
        ]
      },
      {
        "queens": [
          "pearl"
        ]
      },
      {
        "queens": [
          "violet"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ginger"
        ]
      },
      {
        "queens": [
          "pearl"
        ]
      },
      {
        "queens": [
          "violet"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kennedy"
        ]
      }
    ],
    "notes": "Kennedy eliminated pre-finale",
    "verified": true,
    "flags": [
      "ambiguous_name_match"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_7",
      "revision": 1333360798,
      "sha256": "edd07b2fb44ee7a7971125a9874bb318a7f54e2e2ae66beb7325b14b27a8c4fb",
      "fetchedAt": "2026-04-21T22:37:30.725Z",
      "quote": "Ep 12: Ginger Minj vs. Kennedy Davenport vs. Pearl vs. Violet Chachki — \"Born Naked\" (RuPaul ft. Clairy Browne)"
    }
  },
  {
    "id": "s08-e01-1",
    "seasonId": "s08",
    "episode": 1,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Applause",
      "artist": "Lady Gaga",
      "raw": "\"Applause\" — Lady Gaga"
    },
    "sides": [
      {
        "queens": [
          "laila"
        ]
      },
      {
        "queens": [
          "naysha"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "laila"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "naysha"
        ]
      }
    ],
    "notes": "Naysha shock first out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_8",
      "revision": 1326315697,
      "sha256": "120c00debef1bb701a35136095af6eb75ba5991fce3561b298036b803ab7d2b2",
      "fetchedAt": "2026-04-21T22:37:31.255Z",
      "quote": "Ep 1: Laila McQueen vs. Naysha Lopez — \"Applause\" (Lady Gaga)"
    }
  },
  {
    "id": "s08-e02-1",
    "seasonId": "s08",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "double_sashay",
    "song": {
      "title": "I Will Survive",
      "artist": "Gloria Gaynor",
      "raw": "\"I Will Survive\" — Gloria Gaynor"
    },
    "sides": [
      {
        "queens": [
          "dax"
        ]
      },
      {
        "queens": [
          "laila"
        ]
      }
    ],
    "winners": [],
    "eliminated": [
      {
        "queens": [
          "dax"
        ]
      },
      {
        "queens": [
          "laila"
        ]
      }
    ],
    "notes": "double elimination, both out",
    "verified": true,
    "flags": [
      "ambiguous_winner"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_8",
      "revision": 1326315697,
      "sha256": "120c00debef1bb701a35136095af6eb75ba5991fce3561b298036b803ab7d2b2",
      "fetchedAt": "2026-04-21T22:37:31.255Z",
      "quote": "Ep 2: Dax ExclamationPoint vs. Laila McQueen — \"I Will Survive\" (Gloria Gaynor)"
    }
  },
  {
    "id": "s08-e03-1",
    "seasonId": "s08",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Mesmerized (Freemasons Radio Edit)",
      "artist": "Faith Evans",
      "raw": "\"Mesmerized (Freemasons Radio Edit)\" — Faith Evans"
    },
    "sides": [
      {
        "queens": [
          "cynthia"
        ]
      },
      {
        "queens": [
          "robbie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "robbie"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "cynthia"
        ]
      }
    ],
    "notes": "Cucu sashays",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_8",
      "revision": 1326315697,
      "sha256": "120c00debef1bb701a35136095af6eb75ba5991fce3561b298036b803ab7d2b2",
      "fetchedAt": "2026-04-21T22:37:31.255Z",
      "quote": "Ep 3: Cynthia Lee Fontaine vs. Robbie Turner — \"Mesmerized (Freemasons Radio Edit)\" (Faith Evans)"
    }
  },
  {
    "id": "s08-e04-1",
    "seasonId": "s08",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Call Me",
      "artist": "Blondie",
      "raw": "\"Call Me\" — Blondie"
    },
    "sides": [
      {
        "queens": [
          "chichi"
        ]
      },
      {
        "queens": [
          "naysha"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "chichi"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "naysha"
        ]
      }
    ],
    "notes": "Naysha returned, out again",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_8",
      "revision": 1326315697,
      "sha256": "120c00debef1bb701a35136095af6eb75ba5991fce3561b298036b803ab7d2b2",
      "fetchedAt": "2026-04-21T22:37:31.255Z",
      "quote": "Ep 4: Chi Chi DeVayne vs. Naysha Lopez — \"Call Me\" (Blondie)"
    }
  },
  {
    "id": "s08-e05-1",
    "seasonId": "s08",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Causing a Commotion",
      "artist": "Madonna",
      "raw": "\"Causing a Commotion\" — Madonna"
    },
    "sides": [
      {
        "queens": [
          "acidbetty"
        ]
      },
      {
        "queens": [
          "naomi"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "naomi"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "acidbetty"
        ]
      }
    ],
    "notes": "Acid Betty finally out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_8",
      "revision": 1326315697,
      "sha256": "120c00debef1bb701a35136095af6eb75ba5991fce3561b298036b803ab7d2b2",
      "fetchedAt": "2026-04-21T22:37:31.255Z",
      "quote": "Ep 5: Acid Betty vs. Naomi Smalls — \"Causing a Commotion\" (Madonna)"
    }
  },
  {
    "id": "s08-e06-1",
    "seasonId": "s08",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "I Love It",
      "artist": "Icona Pop ft. Charli XCX",
      "raw": "\"I Love It\" — Icona Pop ft. Charli XCX"
    },
    "sides": [
      {
        "queens": [
          "derrick"
        ]
      },
      {
        "queens": [
          "robbie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "derrick"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "robbie"
        ]
      }
    ],
    "notes": "Robbie's hats, Derrick survives",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_8",
      "revision": 1326315697,
      "sha256": "120c00debef1bb701a35136095af6eb75ba5991fce3561b298036b803ab7d2b2",
      "fetchedAt": "2026-04-21T22:37:31.255Z",
      "quote": "Ep 6: Derrick Barry vs. Robbie Turner — \"I Love It\" (Icona Pop ft. Charli XCX)"
    }
  },
  {
    "id": "s08-e07-1",
    "seasonId": "s08",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "And I Am Telling You I'm Not Going",
      "artist": "Jennifer Holliday",
      "raw": "\"And I Am Telling You I'm Not Going\" — Jennifer Holliday"
    },
    "sides": [
      {
        "queens": [
          "chichi"
        ]
      },
      {
        "queens": [
          "thorgy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "chichi"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "thorgy"
        ]
      }
    ],
    "notes": "Chi Chi's finest moment",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_8",
      "revision": 1326315697,
      "sha256": "120c00debef1bb701a35136095af6eb75ba5991fce3561b298036b803ab7d2b2",
      "fetchedAt": "2026-04-21T22:37:31.255Z",
      "quote": "Ep 7: Chi Chi DeVayne vs. Thorgy Thor — \"And I Am Telling You I'm Not Going\" (Jennifer Holliday)"
    }
  },
  {
    "id": "s08-e08-1",
    "seasonId": "s08",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "You Make Me Feel (Mighty Real)",
      "artist": "Sylvester",
      "raw": "\"You Make Me Feel (Mighty Real)\" — Sylvester"
    },
    "sides": [
      {
        "queens": [
          "bob"
        ]
      },
      {
        "queens": [
          "derrick"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "bob"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "derrick"
        ]
      }
    ],
    "notes": "Bob dominant",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_8",
      "revision": 1326315697,
      "sha256": "120c00debef1bb701a35136095af6eb75ba5991fce3561b298036b803ab7d2b2",
      "fetchedAt": "2026-04-21T22:37:31.255Z",
      "quote": "Ep 8: Bob the Drag Queen vs. Derrick Barry — \"You Make Me Feel (Mighty Real)\" (Sylvester)"
    }
  },
  {
    "id": "s08-e09-1",
    "seasonId": "s08",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "multi_advance",
    "song": {
      "title": "The Realness",
      "artist": "RuPaul",
      "raw": "\"The Realness\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "bob"
        ]
      },
      {
        "queens": [
          "chichi"
        ]
      },
      {
        "queens": [
          "kimchi"
        ]
      },
      {
        "queens": [
          "naomi"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "bob"
        ]
      },
      {
        "queens": [
          "kimchi"
        ]
      },
      {
        "queens": [
          "naomi"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "chichi"
        ]
      }
    ],
    "notes": "Chi Chi eliminated pre-finale",
    "verified": true,
    "flags": [
      "ambiguous_name_match"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_8",
      "revision": 1326315697,
      "sha256": "120c00debef1bb701a35136095af6eb75ba5991fce3561b298036b803ab7d2b2",
      "fetchedAt": "2026-04-21T22:37:31.255Z",
      "quote": "Ep 9: Bob the Drag Queen vs. Chi Chi DeVayne vs. Kim Chi vs. Naomi Smalls — \"The Realness\" (RuPaul)"
    }
  },
  {
    "id": "s09-e02-1",
    "seasonId": "s09",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Love Shack",
      "artist": "The B-52's",
      "raw": "\"Love Shack\" — The B-52's"
    },
    "sides": [
      {
        "queens": [
          "jaymes"
        ]
      },
      {
        "queens": [
          "kimora"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kimora"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jaymes"
        ]
      }
    ],
    "notes": "Jaymes first out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_9",
      "revision": 1328960311,
      "sha256": "c560b99326e27aff73db447ba9b6ca9f418032881b0c835ef2aa41bd9a981628",
      "fetchedAt": "2026-04-21T22:37:31.785Z",
      "quote": "Ep 2: Jaymes Mansfield vs. Kimora Blac — \"Love Shack\" (The B-52's)"
    }
  },
  {
    "id": "s09-e03-1",
    "seasonId": "s09",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Holding Out for a Hero",
      "artist": "Bonnie Tyler",
      "raw": "\"Holding Out for a Hero\" — Bonnie Tyler"
    },
    "sides": [
      {
        "queens": [
          "aja"
        ]
      },
      {
        "queens": [
          "kimora"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "aja"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kimora"
        ]
      }
    ],
    "notes": "Aja rough but safe",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_9",
      "revision": 1328960311,
      "sha256": "c560b99326e27aff73db447ba9b6ca9f418032881b0c835ef2aa41bd9a981628",
      "fetchedAt": "2026-04-21T22:37:31.785Z",
      "quote": "Ep 3: Aja vs. Kimora Blac — \"Holding Out for a Hero\" (Bonnie Tyler)"
    }
  },
  {
    "id": "s09-e04-1",
    "seasonId": "s09",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "I Wanna Go",
      "artist": "Britney Spears",
      "raw": "\"I Wanna Go\" — Britney Spears"
    },
    "sides": [
      {
        "queens": [
          "charlie"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "charlie"
        ]
      }
    ],
    "notes": "Charlie freezes up",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_9",
      "revision": 1328960311,
      "sha256": "c560b99326e27aff73db447ba9b6ca9f418032881b0c835ef2aa41bd9a981628",
      "fetchedAt": "2026-04-21T22:37:31.785Z",
      "quote": "Ep 4: Charlie Hides vs. Trinity Taylor — \"I Wanna Go\" (Britney Spears)"
    }
  },
  {
    "id": "s09-e05-1",
    "seasonId": "s09",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "double_shantay",
    "song": {
      "title": "Woman Up",
      "artist": "Meghan Trainor",
      "raw": "\"Woman Up\" — Meghan Trainor"
    },
    "sides": [
      {
        "queens": [
          "cynthia"
        ]
      },
      {
        "queens": [
          "farrah"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "cynthia"
        ]
      },
      {
        "queens": [
          "farrah"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Eureka medically removed",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_9",
      "revision": 1328960311,
      "sha256": "c560b99326e27aff73db447ba9b6ca9f418032881b0c835ef2aa41bd9a981628",
      "fetchedAt": "2026-04-21T22:37:31.785Z",
      "quote": "Ep 5: Cynthia Lee Fontaine vs. Farrah Moan — \"Woman Up\" (Meghan Trainor)"
    }
  },
  {
    "id": "s09-e06-1",
    "seasonId": "s09",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Music",
      "artist": "Madonna",
      "raw": "\"Music\" — Madonna"
    },
    "sides": [
      {
        "queens": [
          "cynthia"
        ]
      },
      {
        "queens": [
          "peppermint"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "peppermint"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "cynthia"
        ]
      }
    ],
    "notes": "Cucu sent home",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_9",
      "revision": 1328960311,
      "sha256": "c560b99326e27aff73db447ba9b6ca9f418032881b0c835ef2aa41bd9a981628",
      "fetchedAt": "2026-04-21T22:37:31.785Z",
      "quote": "Ep 6: Cynthia Lee Fontaine vs. Peppermint — \"Music\" (Madonna)"
    }
  },
  {
    "id": "s09-e07-1",
    "seasonId": "s09",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Finally",
      "artist": "CeCe Peniston",
      "raw": "\"Finally\" — CeCe Peniston"
    },
    "sides": [
      {
        "queens": [
          "aja"
        ]
      },
      {
        "queens": [
          "nina_bonina_brown"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "nina_bonina_brown"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "aja"
        ]
      }
    ],
    "notes": "Aja finally out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_9",
      "revision": 1328960311,
      "sha256": "c560b99326e27aff73db447ba9b6ca9f418032881b0c835ef2aa41bd9a981628",
      "fetchedAt": "2026-04-21T22:37:31.785Z",
      "quote": "Ep 7: Aja vs. Nina Bo'nina Brown — \"Finally\" (CeCe Peniston)"
    }
  },
  {
    "id": "s09-e08-1",
    "seasonId": "s09",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Baby I'm Burnin'",
      "artist": "Dolly Parton",
      "raw": "\"Baby I'm Burning\" — Dolly Parton"
    },
    "sides": [
      {
        "queens": [
          "alexis_michelle"
        ]
      },
      {
        "queens": [
          "farrah"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alexis_michelle"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "farrah"
        ]
      }
    ],
    "notes": "Farrah eliminated",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_9",
      "revision": 1328960311,
      "sha256": "c560b99326e27aff73db447ba9b6ca9f418032881b0c835ef2aa41bd9a981628",
      "fetchedAt": "2026-04-21T22:37:31.785Z",
      "quote": "Ep 8: Alexis Michelle vs. Farrah Moan — \"Baby I'm Burnin'\" (Dolly Parton)"
    }
  },
  {
    "id": "s09-e09-1",
    "seasonId": "s09",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Greedy",
      "artist": "Ariana Grande",
      "raw": "\"Greedy\" — Ariana Grande"
    },
    "sides": [
      {
        "queens": [
          "nina_bonina_brown"
        ]
      },
      {
        "queens": [
          "valentina"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "nina_bonina_brown"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "valentina"
        ]
      }
    ],
    "notes": "Valentina mask scandal",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_9",
      "revision": 1328960311,
      "sha256": "c560b99326e27aff73db447ba9b6ca9f418032881b0c835ef2aa41bd9a981628",
      "fetchedAt": "2026-04-21T22:37:31.785Z",
      "quote": "Ep 9: Nina Bo'nina Brown vs. Valentina — \"Greedy\" (Ariana Grande)"
    }
  },
  {
    "id": "s09-e10-1",
    "seasonId": "s09",
    "episode": 10,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Cool for the Summer",
      "artist": "Demi Lovato",
      "raw": "\"Cool for the Summer\" — Demi Lovato"
    },
    "sides": [
      {
        "queens": [
          "nina_bonina_brown"
        ]
      },
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "nina_bonina_brown"
        ]
      }
    ],
    "notes": "Nina finally out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_9",
      "revision": 1328960311,
      "sha256": "c560b99326e27aff73db447ba9b6ca9f418032881b0c835ef2aa41bd9a981628",
      "fetchedAt": "2026-04-21T22:37:31.785Z",
      "quote": "Ep 10: Nina Bo'nina Brown vs. Shea Couleé — \"Cool for the Summer\" (Demi Lovato)"
    }
  },
  {
    "id": "s09-e11-1",
    "seasonId": "s09",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Macho Man",
      "artist": "Village People",
      "raw": "\"Macho Man\" — Village People"
    },
    "sides": [
      {
        "queens": [
          "alexis_michelle"
        ]
      },
      {
        "queens": [
          "peppermint"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "peppermint"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "alexis_michelle"
        ]
      }
    ],
    "notes": "Alexis out pre-finale",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_9",
      "revision": 1328960311,
      "sha256": "c560b99326e27aff73db447ba9b6ca9f418032881b0c835ef2aa41bd9a981628",
      "fetchedAt": "2026-04-21T22:37:31.785Z",
      "quote": "Ep 11: Alexis Michelle vs. Peppermint — \"Macho Man\" (Village People)"
    }
  },
  {
    "id": "s09-e14-sf1-1",
    "seasonId": "s09",
    "episode": 14,
    "episodeLabel": "Finale",
    "round": "SF1",
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "single_winner",
    "song": {
      "title": "Stronger",
      "artist": "Britney Spears",
      "raw": "\"Stronger\" — Britney Spears"
    },
    "sides": [
      {
        "queens": [
          "peppermint"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "peppermint"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "notes": "Peppermint advances",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_9",
      "revision": 1328960311,
      "sha256": "c560b99326e27aff73db447ba9b6ca9f418032881b0c835ef2aa41bd9a981628",
      "fetchedAt": "2026-04-21T22:37:31.785Z",
      "quote": "Ep 14: Peppermint vs. Trinity Taylor — \"Stronger\" (Britney Spears)"
    }
  },
  {
    "id": "s09-e14-sf2-1",
    "seasonId": "s09",
    "episode": 14,
    "episodeLabel": "Finale",
    "round": "SF2",
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "single_winner",
    "song": {
      "title": "So Emotional",
      "artist": "Whitney Houston",
      "raw": "\"So Emotional\" — Whitney Houston"
    },
    "sides": [
      {
        "queens": [
          "sasha_velour"
        ]
      },
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "sasha_velour"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "notes": "Sasha rose petal reveal",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_9",
      "revision": 1328960311,
      "sha256": "c560b99326e27aff73db447ba9b6ca9f418032881b0c835ef2aa41bd9a981628",
      "fetchedAt": "2026-04-21T22:37:31.785Z",
      "quote": "Ep 14: Sasha Velour vs. Shea Couleé — \"So Emotional\" (Whitney Houston)"
    }
  },
  {
    "id": "s09-e14-final-1",
    "seasonId": "s09",
    "episode": 14,
    "episodeLabel": "Finale",
    "round": "Final",
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "single_winner",
    "song": {
      "title": "It's Not Right But It's Okay (Thunderpuss Remix)",
      "artist": "Whitney Houston",
      "raw": "\"It's Not Right But It's Okay\" (Thunderpuss Remix) — Whitney Houston"
    },
    "sides": [
      {
        "queens": [
          "peppermint"
        ]
      },
      {
        "queens": [
          "sasha_velour"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "sasha_velour"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "peppermint"
        ]
      }
    ],
    "notes": "Sasha crowned winner",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_9",
      "revision": 1328960311,
      "sha256": "c560b99326e27aff73db447ba9b6ca9f418032881b0c835ef2aa41bd9a981628",
      "fetchedAt": "2026-04-21T22:37:31.785Z",
      "quote": "Ep 14: Peppermint vs. Sasha Velour — \"It's Not Right But It's Okay (Thunderpuss Remix)\" (Whitney Houston)"
    }
  },
  {
    "id": "s10-e01-1",
    "seasonId": "s10",
    "episode": 1,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Ain't No Other Man",
      "artist": "Christina Aguilera",
      "raw": "\"Ain't No Other Man\" — Christina Aguilera"
    },
    "sides": [
      {
        "queens": [
          "kalorie"
        ]
      },
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kalorie"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "notes": "\"Miss Vanjie\" exit meme born",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 1: Kalorie Karbdashian Williams vs. Vanessa Vanjie Mateo — \"Ain't No Other Man\" (Christina Aguilera)"
    }
  },
  {
    "id": "s10-e02-1",
    "seasonId": "s10",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Best of My Love",
      "artist": "The Emotions",
      "raw": "\"Best of My Love\" — The Emotions"
    },
    "sides": [
      {
        "queens": [
          "eureka"
        ]
      },
      {
        "queens": [
          "kalorie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "eureka"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kalorie"
        ]
      }
    ],
    "notes": "forgettable first real cut",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 2: Eureka vs. Kalorie Karbdashian Williams — \"Best of My Love\" (The Emotions)"
    }
  },
  {
    "id": "s10-e03-1",
    "seasonId": "s10",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Celebrity Skin",
      "artist": "Hole",
      "raw": "\"Celebrity Skin\" — Hole"
    },
    "sides": [
      {
        "queens": [
          "mayhem"
        ]
      },
      {
        "queens": [
          "yuhua"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "mayhem"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "yuhua"
        ]
      }
    ],
    "notes": "rock lip sync mismatch",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 3: Mayhem Miller vs. Yuhua Hamasaki — \"Celebrity Skin\" (Hole)"
    }
  },
  {
    "id": "s10-e04-1",
    "seasonId": "s10",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Pound the Alarm",
      "artist": "Nicki Minaj",
      "raw": "\"Pound the Alarm\" — Nicki Minaj"
    },
    "sides": [
      {
        "queens": [
          "dusty"
        ]
      },
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "dusty"
        ]
      }
    ],
    "notes": "wig-snatch exit for Dusty",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 4: Dusty Ray Bottoms vs. Monét X Change — \"Pound the Alarm\" (Nicki Minaj)"
    }
  },
  {
    "id": "s10-e05-1",
    "seasonId": "s10",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Man! I Feel Like a Woman!",
      "artist": "Shania Twain",
      "raw": "\"Man! I Feel Like a Woman!\" — Shania Twain"
    },
    "sides": [
      {
        "queens": [
          "mayhem"
        ]
      },
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mayhem"
        ]
      }
    ],
    "notes": "shocking Mayhem exit",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 5: Mayhem Miller vs. Monét X Change — \"Man! I Feel Like a Woman!\" (Shania Twain)"
    }
  },
  {
    "id": "s10-e06-1",
    "seasonId": "s10",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "I'm Coming Out",
      "artist": "Diana Ross",
      "raw": "\"I'm Coming Out\" — Diana Ross"
    },
    "sides": [
      {
        "queens": [
          "blair"
        ]
      },
      {
        "queens": [
          "vixen"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "vixen"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "blair"
        ]
      }
    ],
    "notes": "Blair's earnest goodbye",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 6: Blair St. Clair vs. The Vixen — \"I'm Coming Out\" (Diana Ross)"
    }
  },
  {
    "id": "s10-e07-1",
    "seasonId": "s10",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Cut to the Feeling",
      "artist": "Carly Rae Jepsen",
      "raw": "\"Cut to the Feeling\" — Carly Rae Jepsen"
    },
    "sides": [
      {
        "queens": [
          "monique"
        ]
      },
      {
        "queens": [
          "vixen"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "vixen"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "monique"
        ]
      }
    ],
    "notes": "Vixen double-kill streak",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 7: Monique Heart vs. The Vixen — \"Cut to the Feeling\" (Carly Rae Jepsen)"
    }
  },
  {
    "id": "s10-e08-1",
    "seasonId": "s10",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Groove Is in the Heart",
      "artist": "Deee-Lite",
      "raw": "\"Groove Is in the Heart\" — Deee-Lite"
    },
    "sides": [
      {
        "queens": [
          "asia"
        ]
      },
      {
        "queens": [
          "vixen"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "asia"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "vixen"
        ]
      }
    ],
    "notes": "Vixen finally goes home",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 8: Asia O'Hara vs. The Vixen — \"Groove Is in the Heart\" (Deee-Lite)"
    }
  },
  {
    "id": "s10-e09-1",
    "seasonId": "s10",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "double_shantay",
    "song": {
      "title": "New Attitude",
      "artist": "Patti LaBelle",
      "raw": "\"New Attitude\" — Patti LaBelle"
    },
    "sides": [
      {
        "queens": [
          "eureka"
        ]
      },
      {
        "queens": [
          "kameron"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "eureka"
        ]
      },
      {
        "queens": [
          "kameron"
        ]
      }
    ],
    "eliminated": [],
    "notes": "no elimination, both safe",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 9: Eureka vs. Kameron Michaels — \"New Attitude\" (Patti LaBelle)"
    }
  },
  {
    "id": "s10-e10-1",
    "seasonId": "s10",
    "episode": 10,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Good as Hell",
      "artist": "Lizzo",
      "raw": "\"Good as Hell\" — Lizzo"
    },
    "sides": [
      {
        "queens": [
          "kameron"
        ]
      },
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kameron"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "notes": "Kameron assassin mode begins",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 10: Kameron Michaels vs. Monét X Change — \"Good as Hell\" (Lizzo)"
    }
  },
  {
    "id": "s10-e11-1",
    "seasonId": "s10",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Nasty Girl",
      "artist": "Vanity 6",
      "raw": "\"Nasty Girl\" — Vanity 6"
    },
    "sides": [
      {
        "queens": [
          "kameron"
        ]
      },
      {
        "queens": [
          "cracker"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kameron"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "cracker"
        ]
      }
    ],
    "notes": "Kameron ousts the frontrunner",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 11: Kameron Michaels vs. Miz Cracker — \"Nasty Girl\" (Vanity 6)"
    }
  },
  {
    "id": "s10-e14-1",
    "seasonId": "s10",
    "episode": 14,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Nasty",
      "artist": "Janet Jackson",
      "raw": "\"Nasty\" — Janet Jackson"
    },
    "sides": [
      {
        "queens": [
          "asia"
        ]
      },
      {
        "queens": [
          "kameron"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kameron"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "asia"
        ]
      }
    ],
    "notes": "Asia's butterfly reveal fail",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 14: Asia O'Hara vs. Kameron Michaels — \"Nasty\" (Janet Jackson)"
    }
  },
  {
    "id": "s10-e14-2",
    "seasonId": "s10",
    "episode": 14,
    "sequence": 2,
    "type": "regular",
    "outcome": "double_shantay",
    "song": {
      "title": "If",
      "artist": "Janet Jackson",
      "raw": "\"If\" — Janet Jackson"
    },
    "sides": [
      {
        "queens": [
          "aquaria"
        ]
      },
      {
        "queens": [
          "eureka"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "aquaria"
        ]
      },
      {
        "queens": [
          "eureka"
        ]
      }
    ],
    "eliminated": [],
    "notes": "both advance to 3-way final",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 14: Aquaria vs. Eureka — \"If\" (Janet Jackson)"
    }
  },
  {
    "id": "s10-e14-3",
    "seasonId": "s10",
    "episode": 14,
    "sequence": 3,
    "type": "regular",
    "outcome": "multi_advance",
    "song": {
      "title": "Bang Bang",
      "artist": "Jessie J, Ariana Grande, Nicki Minaj",
      "raw": "\"Bang Bang\" — Jessie J, Ariana Grande, Nicki Minaj"
    },
    "sides": [
      {
        "queens": [
          "aquaria"
        ]
      },
      {
        "queens": [
          "eureka"
        ]
      },
      {
        "queens": [
          "kameron"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "aquaria"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kameron"
        ]
      }
    ],
    "notes": "Aquaria crowned S10 winner [Wiki: 3-way Aquaria vs Eureka vs Kameron]",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_10",
      "revision": 1314447653,
      "sha256": "b2cead856f3fd08b7ec61eb8afde1ec478b53dd776e67f690d17a73b2e57521e",
      "fetchedAt": "2026-04-21T22:37:32.357Z",
      "quote": "Ep 14: Aquaria vs. Eureka vs. Kameron Michaels — \"Bang Bang\" (Jessie J, Ariana Grande, Nicki Minaj)"
    }
  },
  {
    "id": "s11-e01-1",
    "seasonId": "s11",
    "episode": 1,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "The Best of Both Worlds",
      "artist": "Hannah Montana",
      "raw": "\"The Best of Both Worlds\" — Hannah Montana"
    },
    "sides": [
      {
        "queens": [
          "kahanna"
        ]
      },
      {
        "queens": [
          "soju"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kahanna"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "soju"
        ]
      }
    ],
    "notes": "premiere, Soju cyst exit",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 1: Kahanna Montrese vs. Soju — \"The Best of Both Worlds\" (Hannah Montana)"
    }
  },
  {
    "id": "s11-e02-1",
    "seasonId": "s11",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Work Bitch",
      "artist": "Britney Spears",
      "raw": "\"Work Bitch\" — Britney Spears"
    },
    "sides": [
      {
        "queens": [
          "kahanna"
        ]
      },
      {
        "queens": [
          "mercedes"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "mercedes"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kahanna"
        ]
      }
    ],
    "notes": "Kahanna out second",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 2: Kahanna Montrese vs. Mercedes Iman Diamond — \"Work Bitch\" (Britney Spears)"
    }
  },
  {
    "id": "s11-e03-1",
    "seasonId": "s11",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "multi_advance",
    "song": {
      "title": "Waiting for Tonight (Hex Hector Mix)",
      "artist": "Jennifer Lopez",
      "raw": "\"Waiting for Tonight (Hex Hector Mix)\" — Jennifer Lopez"
    },
    "sides": [
      {
        "queens": [
          "akeria"
        ]
      },
      {
        "queens": [
          "honey11"
        ]
      },
      {
        "queens": [
          "plastique"
        ]
      },
      {
        "queens": [
          "rajah"
        ]
      },
      {
        "queens": [
          "scarlet"
        ]
      },
      {
        "queens": [
          "shuga"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "akeria"
        ]
      },
      {
        "queens": [
          "plastique"
        ]
      },
      {
        "queens": [
          "rajah"
        ]
      },
      {
        "queens": [
          "scarlet"
        ]
      },
      {
        "queens": [
          "shuga"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "honey11"
        ]
      }
    ],
    "notes": "Honey Davenport eliminated",
    "verified": true,
    "flags": [
      "ambiguous_winner",
      "ambiguous_name_match"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 3: A'keria C. Davenport vs. Honey Davenport vs. Plastique Tiara vs. Ra'Jah O'Hara vs. Scarlet Envy vs. Shuga Cain — \"Waiting for Tonight (Hex Hector Mix)\" (Jennifer Lopez)"
    }
  },
  {
    "id": "s11-e04-1",
    "seasonId": "s11",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Living in America",
      "artist": "James Brown",
      "raw": "\"Living in America\" — James Brown"
    },
    "sides": [
      {
        "queens": [
          "mercedes"
        ]
      },
      {
        "queens": [
          "rajah"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "rajah"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mercedes"
        ]
      }
    ],
    "notes": "Trump Rusical aftermath",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 4: Mercedes Iman Diamond vs. Ra'Jah O'Hara — \"Living in America\" (James Brown)"
    }
  },
  {
    "id": "s11-e05-1",
    "seasonId": "s11",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "I'm Your Baby Tonight",
      "artist": "Whitney Houston",
      "raw": "\"I'm Your Baby Tonight\" — Whitney Houston"
    },
    "sides": [
      {
        "queens": [
          "ariel"
        ]
      },
      {
        "queens": [
          "shuga"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shuga"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "ariel"
        ]
      }
    ],
    "notes": "Monster Ball elim, Ariel sashays",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 5: Ariel Versace vs. Shuga Cain — \"I'm Your Baby Tonight\" (Whitney Houston)"
    }
  },
  {
    "id": "s11-e06-1",
    "seasonId": "s11",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Last Dance",
      "artist": "Donna Summer",
      "raw": "\"Last Dance\" — Donna Summer"
    },
    "sides": [
      {
        "queens": [
          "rajah"
        ]
      },
      {
        "queens": [
          "scarlet"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "rajah"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "scarlet"
        ]
      }
    ],
    "notes": "Draglympics, Scarlet's shock exit",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 6: Ra'Jah O'Hara vs. Scarlet Envy — \"Last Dance\" (Donna Summer)"
    }
  },
  {
    "id": "s11-e07-1",
    "seasonId": "s11",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Strut",
      "artist": "Sheena Easton",
      "raw": "\"Strut\" — Sheena Easton"
    },
    "sides": [
      {
        "queens": [
          "akeria"
        ]
      },
      {
        "queens": [
          "rajah"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "akeria"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "rajah"
        ]
      }
    ],
    "notes": "Ra'Jah finally cut",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 7: A'keria C. Davenport vs. Ra'Jah O'Hara — \"Strut\" (Sheena Easton)"
    }
  },
  {
    "id": "s11-e08-1",
    "seasonId": "s11",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "double_shantay",
    "song": {
      "title": "Sorry Not Sorry",
      "artist": "Demi Lovato",
      "raw": "\"Sorry Not Sorry\" — Demi Lovato"
    },
    "sides": [
      {
        "queens": [
          "brookelynn"
        ]
      },
      {
        "queens": [
          "yvie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "brookelynn"
        ]
      },
      {
        "queens": [
          "yvie"
        ]
      }
    ],
    "eliminated": [],
    "notes": "one of the best ever",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 8: Brooke Lynn Hytes vs. Yvie Oddly — \"Sorry Not Sorry\" (Demi Lovato)"
    }
  },
  {
    "id": "s11-e09-1",
    "seasonId": "s11",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Hood Boy",
      "artist": "Fantasia",
      "raw": "\"Hood Boy\" — Fantasia"
    },
    "sides": [
      {
        "queens": [
          "plastique"
        ]
      },
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "plastique"
        ]
      }
    ],
    "notes": "Plastique goes home",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 9: Plastique Tiara vs. Vanessa Vanjie Mateo — \"Hood Boy\" (Fantasia)"
    }
  },
  {
    "id": "s11-e10-1",
    "seasonId": "s11",
    "episode": 10,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "No More Drama",
      "artist": "Mary J. Blige",
      "raw": "\"No More Drama\" — Mary J. Blige"
    },
    "sides": [
      {
        "queens": [
          "shuga"
        ]
      },
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "shuga"
        ]
      }
    ],
    "notes": "Shuga's emotional exit",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 10: Shuga Cain vs. Vanessa Vanjie Mateo — \"No More Drama\" (Mary J. Blige)"
    }
  },
  {
    "id": "s11-e11-1",
    "seasonId": "s11",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "No Scrubs",
      "artist": "TLC",
      "raw": "\"No Scrubs\" — TLC"
    },
    "sides": [
      {
        "queens": [
          "nina11"
        ]
      },
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "nina11"
        ]
      }
    ],
    "notes": "Nina 5th, fan-favorite out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 11: Nina West vs. Silky Nutmeg Ganache — \"No Scrubs\" (TLC)"
    }
  },
  {
    "id": "s11-e12-1",
    "seasonId": "s11",
    "episode": 12,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Pride (A Deeper Love)",
      "artist": "Aretha Franklin",
      "raw": "\"Pride (A Deeper Love)\" — Aretha Franklin"
    },
    "sides": [
      {
        "queens": [
          "brookelynn"
        ]
      },
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "brookelynn"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "notes": "tearful Vanjie farewell",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 12: Brooke Lynn Hytes vs. Vanessa Vanjie Mateo — \"Pride (A Deeper Love)\" (Aretha Franklin)"
    }
  },
  {
    "id": "s11-e14-1",
    "seasonId": "s11",
    "episode": 14,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Bootylicious",
      "artist": "Destiny's Child",
      "raw": "\"Bootylicious\" — Destiny's Child"
    },
    "sides": [
      {
        "queens": [
          "brookelynn"
        ]
      },
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "brookelynn"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "notes": "finale round 1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 14: Brooke Lynn Hytes vs. Silky Nutmeg Ganache — \"Bootylicious\" (Destiny's Child)"
    }
  },
  {
    "id": "s11-e14-2",
    "seasonId": "s11",
    "episode": 14,
    "sequence": 2,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "SOS",
      "artist": "Rihanna",
      "raw": "\"SOS\" — Rihanna"
    },
    "sides": [
      {
        "queens": [
          "akeria"
        ]
      },
      {
        "queens": [
          "yvie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "yvie"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "akeria"
        ]
      }
    ],
    "notes": "finale round 1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 14: A'keria C. Davenport vs. Yvie Oddly — \"SOS\" (Rihanna)"
    }
  },
  {
    "id": "s11-e14-3",
    "seasonId": "s11",
    "episode": 14,
    "sequence": 3,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "The Edge of Glory",
      "artist": "Lady Gaga",
      "raw": "\"The Edge of Glory\" — Lady Gaga"
    },
    "sides": [
      {
        "queens": [
          "brookelynn"
        ]
      },
      {
        "queens": [
          "yvie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "yvie"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "brookelynn"
        ]
      }
    ],
    "notes": "Yvie's flip gag, crowning",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_11",
      "revision": 1314447707,
      "sha256": "42902600ea4975ad4e63d25b5d4dde7d3ee22778f83f33539a44e59c2a9f5746",
      "fetchedAt": "2026-04-21T22:37:32.863Z",
      "quote": "Ep 14: Brooke Lynn Hytes vs. Yvie Oddly — \"The Edge of Glory\" (Lady Gaga)"
    }
  },
  {
    "id": "s12-e01-1",
    "seasonId": "s12",
    "episode": 1,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Starships",
      "artist": "Nicki Minaj",
      "raw": "\"Starships\" — Nicki Minaj"
    },
    "sides": [
      {
        "queens": [
          "gigi"
        ]
      },
      {
        "queens": [
          "widow"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "widow"
        ]
      }
    ],
    "eliminated": [],
    "notes": "premiere, no elimination",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_12",
      "revision": 1345838007,
      "sha256": "c87e47d19048cffb05b54576bd3dbd59d406df318fad82b4a0f7a8bab800c8a3",
      "fetchedAt": "2026-04-21T22:37:33.392Z",
      "quote": "Ep 1: Gigi Goode vs. Widow Von'Du — \"Starships\" (Nicki Minaj)"
    }
  },
  {
    "id": "s12-e02-1",
    "seasonId": "s12",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Call Your Girlfriend",
      "artist": "Robyn",
      "raw": "\"Call Your Girlfriend\" — Robyn"
    },
    "sides": [
      {
        "queens": [
          "jaida"
        ]
      },
      {
        "queens": [
          "sherry"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jaida"
        ]
      }
    ],
    "eliminated": [],
    "notes": "second half of split premiere, no elim",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_12",
      "revision": 1345838007,
      "sha256": "c87e47d19048cffb05b54576bd3dbd59d406df318fad82b4a0f7a8bab800c8a3",
      "fetchedAt": "2026-04-21T22:37:33.392Z",
      "quote": "Ep 2: Jaida Essence Hall vs. Sherry Pie — \"Call Your Girlfriend\" (Robyn)"
    }
  },
  {
    "id": "s12-e03-1",
    "seasonId": "s12",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Problem",
      "artist": "Ariana Grande ft. Iggy Azalea",
      "raw": "\"Problem\" — Ariana Grande ft. Iggy Azalea"
    },
    "sides": [
      {
        "queens": [
          "dahlia"
        ]
      },
      {
        "queens": [
          "nicky"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "nicky"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "dahlia"
        ]
      }
    ],
    "notes": "first real sashay, Dahlia out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_12",
      "revision": 1345838007,
      "sha256": "c87e47d19048cffb05b54576bd3dbd59d406df318fad82b4a0f7a8bab800c8a3",
      "fetchedAt": "2026-04-21T22:37:33.392Z",
      "quote": "Ep 3: Dahlia Sin vs. Nicky Doll — \"Problem\" (Ariana Grande ft. Iggy Azalea)"
    }
  },
  {
    "id": "s12-e04-1",
    "seasonId": "s12",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "S&M",
      "artist": "Rihanna",
      "raw": "\"S&M\" — Rihanna"
    },
    "sides": [
      {
        "queens": [
          "brita"
        ]
      },
      {
        "queens": [
          "rock"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "brita"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "rock"
        ]
      }
    ],
    "notes": "Rock M. out after Ball",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_12",
      "revision": 1345838007,
      "sha256": "c87e47d19048cffb05b54576bd3dbd59d406df318fad82b4a0f7a8bab800c8a3",
      "fetchedAt": "2026-04-21T22:37:33.392Z",
      "quote": "Ep 4: Brita vs. Rock M. Sakura — \"S&M\" (Rihanna)"
    }
  },
  {
    "id": "s12-e05-1",
    "seasonId": "s12",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Heart to Break",
      "artist": "Kim Petras",
      "raw": "\"Heart to Break\" — Kim Petras"
    },
    "sides": [
      {
        "queens": [
          "heidi"
        ]
      },
      {
        "queens": [
          "nicky"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "heidi"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "nicky"
        ]
      }
    ],
    "notes": "Nicky eliminated, big upset",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_12",
      "revision": 1345838007,
      "sha256": "c87e47d19048cffb05b54576bd3dbd59d406df318fad82b4a0f7a8bab800c8a3",
      "fetchedAt": "2026-04-21T22:37:33.392Z",
      "quote": "Ep 5: Heidi N Closet vs. Nicky Doll — \"Heart to Break\" (Kim Petras)"
    }
  },
  {
    "id": "s12-e06-1",
    "seasonId": "s12",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Let It Go",
      "artist": "Caissie Levy",
      "raw": "\"Let It Go\" — Caissie Levy"
    },
    "sides": [
      {
        "queens": [
          "aiden"
        ]
      },
      {
        "queens": [
          "brita"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "brita"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "aiden"
        ]
      }
    ],
    "notes": "Madonna Rusical, Aiden out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_12",
      "revision": 1345838007,
      "sha256": "c87e47d19048cffb05b54576bd3dbd59d406df318fad82b4a0f7a8bab800c8a3",
      "fetchedAt": "2026-04-21T22:37:33.392Z",
      "quote": "Ep 6: Aiden Zhane vs. Brita — \"Let It Go\" (Caissie Levy)"
    }
  },
  {
    "id": "s12-e07-1",
    "seasonId": "s12",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Burning Up",
      "artist": "Madonna",
      "raw": "\"Burning Up\" — Madonna"
    },
    "sides": [
      {
        "queens": [
          "brita"
        ]
      },
      {
        "queens": [
          "heidi"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "heidi"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "brita"
        ]
      }
    ],
    "notes": "Brita's second time, goes home",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_12",
      "revision": 1345838007,
      "sha256": "c87e47d19048cffb05b54576bd3dbd59d406df318fad82b4a0f7a8bab800c8a3",
      "fetchedAt": "2026-04-21T22:37:33.392Z",
      "quote": "Ep 7: Brita vs. Heidi N Closet — \"Burning Up\" (Madonna)"
    }
  },
  {
    "id": "s12-e08-1",
    "seasonId": "s12",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "This Is My Night",
      "artist": "Chaka Khan",
      "raw": "\"This Is My Night\" — Chaka Khan"
    },
    "sides": [
      {
        "queens": [
          "jan"
        ]
      },
      {
        "queens": [
          "widow"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "widow"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jan"
        ]
      }
    ],
    "notes": "Jan eliminated, fan outcry",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_12",
      "revision": 1345838007,
      "sha256": "c87e47d19048cffb05b54576bd3dbd59d406df318fad82b4a0f7a8bab800c8a3",
      "fetchedAt": "2026-04-21T22:37:33.392Z",
      "quote": "Ep 8: Jan vs. Widow Von'Du — \"This Is My Night\" (Chaka Khan)"
    }
  },
  {
    "id": "s12-e09-1",
    "seasonId": "s12",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Firework",
      "artist": "Katy Perry",
      "raw": "\"Firework\" — Katy Perry"
    },
    "sides": [
      {
        "queens": [
          "jackie"
        ]
      },
      {
        "queens": [
          "widow"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jackie"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "widow"
        ]
      }
    ],
    "notes": "Widow's surprise exit",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_12",
      "revision": 1345838007,
      "sha256": "c87e47d19048cffb05b54576bd3dbd59d406df318fad82b4a0f7a8bab800c8a3",
      "fetchedAt": "2026-04-21T22:37:33.392Z",
      "quote": "Ep 9: Jackie Cox vs. Widow Von'Du — \"Firework\" (Katy Perry)"
    }
  },
  {
    "id": "s12-e10-1",
    "seasonId": "s12",
    "episode": 10,
    "sequence": 1,
    "type": "regular",
    "outcome": "double_shantay",
    "song": {
      "title": "Kill the Lights",
      "artist": "Alex Newell, DJ Cassidy, Nile Rodgers",
      "raw": "\"Kill the Lights\" — Alex Newell, DJ Cassidy ft. Nile Rodgers"
    },
    "sides": [
      {
        "queens": [
          "heidi"
        ]
      },
      {
        "queens": [
          "jackie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "heidi"
        ]
      },
      {
        "queens": [
          "jackie"
        ]
      }
    ],
    "eliminated": [],
    "notes": "both saved, emotional",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_12",
      "revision": 1345838007,
      "sha256": "c87e47d19048cffb05b54576bd3dbd59d406df318fad82b4a0f7a8bab800c8a3",
      "fetchedAt": "2026-04-21T22:37:33.392Z",
      "quote": "Ep 10: Heidi N Closet vs. Jackie Cox — \"Kill the Lights\" (Alex Newell, DJ Cassidy, Nile Rodgers)"
    }
  },
  {
    "id": "s12-e11-1",
    "seasonId": "s12",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "1999",
      "artist": "Prince",
      "raw": "\"1999\" — Prince"
    },
    "sides": [
      {
        "queens": [
          "heidi"
        ]
      },
      {
        "queens": [
          "jaida"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jaida"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "heidi"
        ]
      }
    ],
    "notes": "Heidi 6th, fan favorite out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_12",
      "revision": 1345838007,
      "sha256": "c87e47d19048cffb05b54576bd3dbd59d406df318fad82b4a0f7a8bab800c8a3",
      "fetchedAt": "2026-04-21T22:37:33.392Z",
      "quote": "Ep 11: Heidi N Closet vs. Jaida Essence Hall — \"1999\" (Prince)"
    }
  },
  {
    "id": "s12-e12-1",
    "seasonId": "s12",
    "episode": 12,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "On the Floor",
      "artist": "Jennifer Lopez ft. Pitbull",
      "raw": "\"On the Floor\" — Jennifer Lopez ft. Pitbull"
    },
    "sides": [
      {
        "queens": [
          "crystal"
        ]
      },
      {
        "queens": [
          "jackie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "crystal"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jackie"
        ]
      }
    ],
    "notes": "Jackie out, top 3 set",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_12",
      "revision": 1345838007,
      "sha256": "c87e47d19048cffb05b54576bd3dbd59d406df318fad82b4a0f7a8bab800c8a3",
      "fetchedAt": "2026-04-21T22:37:33.392Z",
      "quote": "Ep 12: Crystal Methyd vs. Jackie Cox — \"On the Floor\" (Jennifer Lopez ft. Pitbull)"
    }
  },
  {
    "id": "s13-e01-1",
    "seasonId": "s13",
    "episode": 1,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Call Me Maybe",
      "artist": "Carly Rae Jepsen",
      "raw": "\"Call Me Maybe\" — Carly Rae Jepsen"
    },
    "sides": [
      {
        "queens": [
          "joey"
        ]
      },
      {
        "queens": [
          "kandy_muse"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kandy_muse"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "joey"
        ]
      }
    ],
    "notes": "Porkchop split, Kandy advances",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 1: Joey Jay vs. Kandy Muse — \"Call Me Maybe\" (Carly Rae Jepsen)"
    }
  },
  {
    "id": "s13-e01-2",
    "seasonId": "s13",
    "episode": 1,
    "sequence": 2,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "When I Grow Up",
      "artist": "The Pussycat Dolls",
      "raw": "\"When I Grow Up\" — The Pussycat Dolls"
    },
    "sides": [
      {
        "queens": [
          "denali"
        ]
      },
      {
        "queens": [
          "lala"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lala"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "denali"
        ]
      }
    ],
    "notes": "Porkchop split, skating Denali loses",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 1: Denali vs. LaLa Ri — \"When I Grow Up\" (The Pussycat Dolls)"
    }
  },
  {
    "id": "s13-e01-3",
    "seasonId": "s13",
    "episode": 1,
    "sequence": 3,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "The Pleasure Principle",
      "artist": "Janet Jackson",
      "raw": "\"The Pleasure Principle\" — Janet Jackson"
    },
    "sides": [
      {
        "queens": [
          "symone"
        ]
      },
      {
        "queens": [
          "tamisha"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "symone"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "tamisha"
        ]
      }
    ],
    "notes": "Porkchop split, Symone stunner",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 1: Symone vs. Tamisha Iman — \"The Pleasure Principle\" (Janet Jackson)"
    }
  },
  {
    "id": "s13-e01-4",
    "seasonId": "s13",
    "episode": 1,
    "sequence": 4,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Rumors",
      "artist": "Lindsay Lohan",
      "raw": "\"Rumors\" — Lindsay Lohan"
    },
    "sides": [
      {
        "queens": [
          "gottmik"
        ]
      },
      {
        "queens": [
          "utica"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "gottmik"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "utica"
        ]
      }
    ],
    "notes": "Porkchop split, goofy vs fierce",
    "verified": true,
    "flags": [
      "ambiguous_name_match"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 1: Gottmik vs. Utica Queen — \"Rumors\" (Lindsay Lohan)"
    }
  },
  {
    "id": "s13-e01-5",
    "seasonId": "s13",
    "episode": 1,
    "sequence": 5,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Ex's & Oh's",
      "artist": "Elle King",
      "raw": "\"Ex's & Oh's\" — Elle King"
    },
    "sides": [
      {
        "queens": [
          "olivia"
        ]
      },
      {
        "queens": [
          "rose"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "olivia"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "rose"
        ]
      }
    ],
    "notes": "Porkchop split, upset win",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 1: Olivia Lux vs. Rosé — \"Ex's & Oh's\" (Elle King)"
    }
  },
  {
    "id": "s13-e01-6",
    "seasonId": "s13",
    "episode": 1,
    "sequence": 6,
    "type": "regular",
    "outcome": "multi_advance",
    "song": {
      "title": "Lady Marmalade",
      "artist": "Christina Aguilera, Lil' Kim, Mýa, Pink",
      "raw": "\"Lady Marmalade\" — Christina Aguilera, Lil' Kim, Mýa, Pink"
    },
    "sides": [
      {
        "queens": [
          "elliott"
        ]
      },
      {
        "queens": [
          "kahmora"
        ]
      },
      {
        "queens": [
          "tina"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "tina"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "elliott"
        ]
      },
      {
        "queens": [
          "kahmora"
        ]
      }
    ],
    "notes": "Three-way porkchop finale",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 1: Elliott with 2 Ts vs. Kahmora Hall vs. Tina Burner — \"Lady Marmalade\" (Christina Aguilera, Lil' Kim, Mýa, Pink)"
    }
  },
  {
    "id": "s13-e02-1",
    "seasonId": "s13",
    "episode": 2,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Break My Heart",
      "artist": "Dua Lipa",
      "raw": "\"Break My Heart\" — Dua Lipa"
    },
    "sides": [
      {
        "queens": [
          "olivia"
        ]
      },
      {
        "queens": [
          "symone"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "symone"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Lip Sync for the Win, no elim",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 2: Olivia Lux vs. Symone — \"Break My Heart\" (Dua Lipa)"
    }
  },
  {
    "id": "s13-e03-1",
    "seasonId": "s13",
    "episode": 3,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "If U Seek Amy",
      "artist": "Britney Spears",
      "raw": "\"If U Seek Amy\" — Britney Spears"
    },
    "sides": [
      {
        "queens": [
          "denali"
        ]
      },
      {
        "queens": [
          "rose"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "denali"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Lip Sync for the Win, no elim",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 3: Denali vs. Rosé — \"If U Seek Amy\" (Britney Spears)"
    }
  },
  {
    "id": "s13-e04-1",
    "seasonId": "s13",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "100% Pure Love",
      "artist": "Crystal Waters",
      "raw": "\"100% Pure Love\" — Crystal Waters"
    },
    "sides": [
      {
        "queens": [
          "denali"
        ]
      },
      {
        "queens": [
          "kahmora"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "denali"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kahmora"
        ]
      }
    ],
    "notes": "First elim, Kahmora sashays",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 4: Denali vs. Kahmora Hall — \"100% Pure Love\" (Crystal Waters)"
    }
  },
  {
    "id": "s13-e05-1",
    "seasonId": "s13",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Fancy",
      "artist": "Iggy Azalea ft. Charli XCX",
      "raw": "\"Fancy\" — Iggy Azalea ft. Charli XCX"
    },
    "sides": [
      {
        "queens": [
          "joey"
        ]
      },
      {
        "queens": [
          "lala"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lala"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "joey"
        ]
      }
    ],
    "notes": "Joey Jay eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 5: Joey Jay vs. LaLa Ri — \"Fancy\" (Iggy Azalea ft. Charli XCX)"
    }
  },
  {
    "id": "s13-e06-1",
    "seasonId": "s13",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Hit 'Em Up Style (Oops!)",
      "artist": "Blu Cantrell",
      "raw": "\"Hit 'Em Up Style (Oops!)\" — Blu Cantrell"
    },
    "sides": [
      {
        "queens": [
          "kandy_muse"
        ]
      },
      {
        "queens": [
          "tamisha"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kandy_muse"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "tamisha"
        ]
      }
    ],
    "notes": "Tamisha eliminated, tense",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 6: Kandy Muse vs. Tamisha Iman — \"Hit 'Em Up Style (Oops!)\" (Blu Cantrell)"
    }
  },
  {
    "id": "s13-e07-1",
    "seasonId": "s13",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Whole Lotta Woman",
      "artist": "Kelly Clarkson",
      "raw": "\"Whole Lotta Woman\" — Kelly Clarkson"
    },
    "sides": [
      {
        "queens": [
          "elliott"
        ]
      },
      {
        "queens": [
          "lala"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "elliott"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "lala"
        ]
      }
    ],
    "notes": "LaLa Ri eliminated, shocker",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 7: Elliott with 2 Ts vs. LaLa Ri — \"Whole Lotta Woman\" (Kelly Clarkson)"
    }
  },
  {
    "id": "s13-e08-1",
    "seasonId": "s13",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Boss",
      "artist": "Fifth Harmony",
      "raw": "\"Boss\" — Fifth Harmony"
    },
    "sides": [
      {
        "queens": [
          "kandy_muse"
        ]
      },
      {
        "queens": [
          "symone"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "symone"
        ]
      }
    ],
    "eliminated": [],
    "notes": "No elim, both saved",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 8: Kandy Muse vs. Symone — \"Boss\" (Fifth Harmony)"
    }
  },
  {
    "id": "s13-e09-1",
    "seasonId": "s13",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Fascinated",
      "artist": "Company B",
      "raw": "\"Fascinated\" — Company B"
    },
    "sides": [
      {
        "queens": [
          "elliott"
        ]
      },
      {
        "queens": [
          "utica"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "utica"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "elliott"
        ]
      }
    ],
    "notes": "Snatch Game, Elliott goes",
    "verified": true,
    "flags": [
      "ambiguous_name_match"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 9: Elliott with 2 Ts vs. Utica Queen — \"Fascinated\" (Company B)"
    }
  },
  {
    "id": "s13-e10-1",
    "seasonId": "s13",
    "episode": 10,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Shackles (Praise You)",
      "artist": "Mary Mary",
      "raw": "\"Shackles (Praise You)\" — Mary Mary"
    },
    "sides": [
      {
        "queens": [
          "denali"
        ]
      },
      {
        "queens": [
          "olivia"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "olivia"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "denali"
        ]
      }
    ],
    "notes": "Denali shocker elimination",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 10: Denali vs. Olivia Lux — \"Shackles (Praise You)\" (Mary Mary)"
    }
  },
  {
    "id": "s13-e11-1",
    "seasonId": "s13",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "My Humps",
      "artist": "Black Eyed Peas",
      "raw": "\"My Humps\" — Black Eyed Peas"
    },
    "sides": [
      {
        "queens": [
          "tina"
        ]
      },
      {
        "queens": [
          "utica"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "utica"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "tina"
        ]
      }
    ],
    "notes": "Tina Burner eliminated",
    "verified": true,
    "flags": [
      "ambiguous_name_match"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 11: Tina Burner vs. Utica Queen — \"My Humps\" (Black Eyed Peas)"
    }
  },
  {
    "id": "s13-e12-1",
    "seasonId": "s13",
    "episode": 12,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "No Tears Left to Cry",
      "artist": "Ariana Grande",
      "raw": "\"No Tears Left to Cry\" — Ariana Grande"
    },
    "sides": [
      {
        "queens": [
          "symone"
        ]
      },
      {
        "queens": [
          "utica"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "symone"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "utica"
        ]
      }
    ],
    "notes": "Utica eliminated, close call",
    "verified": true,
    "flags": [
      "ambiguous_name_match"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 12: Symone vs. Utica Queen — \"No Tears Left to Cry\" (Ariana Grande)"
    }
  },
  {
    "id": "s13-e13-1",
    "seasonId": "s13",
    "episode": 13,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Strong Enough",
      "artist": "Cher",
      "raw": "\"Strong Enough\" — Cher"
    },
    "sides": [
      {
        "queens": [
          "kandy_muse"
        ]
      },
      {
        "queens": [
          "olivia"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kandy_muse"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "olivia"
        ]
      }
    ],
    "notes": "Olivia eliminated pre-finale",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 13: Kandy Muse vs. Olivia Lux — \"Strong Enough\" (Cher)"
    }
  },
  {
    "id": "s13-e15-1",
    "seasonId": "s13",
    "episode": 15,
    "sequence": 1,
    "type": "reunion_assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Be My Lover",
      "artist": "La Bouche",
      "raw": "\"Be My Lover\" — La Bouche"
    },
    "sides": [
      {
        "queens": [
          "denali"
        ]
      },
      {
        "queens": [
          "lala"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "denali"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Reunion lip sync assassin",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 15: Denali vs. LaLa Ri — \"Be My Lover\" (La Bouche)"
    }
  },
  {
    "id": "s13-e16-1",
    "seasonId": "s13",
    "episode": 16,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Work Bitch",
      "artist": "Britney Spears",
      "raw": "\"Work Bitch\" — Britney Spears"
    },
    "sides": [
      {
        "queens": [
          "kandy_muse"
        ]
      },
      {
        "queens": [
          "rose"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kandy_muse"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "rose"
        ]
      }
    ],
    "notes": "Finale bracket R1, Rosé out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 16: Kandy Muse vs. Rosé — \"Work Bitch\" (Britney Spears)"
    }
  },
  {
    "id": "s13-e16-2",
    "seasonId": "s13",
    "episode": 16,
    "sequence": 2,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Gimme More",
      "artist": "Britney Spears",
      "raw": "\"Gimme More\" — Britney Spears"
    },
    "sides": [
      {
        "queens": [
          "gottmik"
        ]
      },
      {
        "queens": [
          "symone"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "symone"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "gottmik"
        ]
      }
    ],
    "notes": "Finale bracket R1, Gottmik out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 16: Gottmik vs. Symone — \"Gimme More\" (Britney Spears)"
    }
  },
  {
    "id": "s13-e16-3",
    "seasonId": "s13",
    "episode": 16,
    "sequence": 3,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Till the World Ends",
      "artist": "Britney Spears",
      "raw": "\"Till the World Ends\" — Britney Spears"
    },
    "sides": [
      {
        "queens": [
          "kandy_muse"
        ]
      },
      {
        "queens": [
          "symone"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "symone"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kandy_muse"
        ]
      }
    ],
    "notes": "Finale crown, all-Britney",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_13",
      "revision": 1332501873,
      "sha256": "9174c97a260529e897ae98488984dd3270734d177aefcf6e685a5327c03c84e1",
      "fetchedAt": "2026-04-21T22:37:33.928Z",
      "quote": "Ep 16: Kandy Muse vs. Symone — \"Till the World Ends\" (Britney Spears)"
    }
  },
  {
    "id": "s14-e01-1",
    "seasonId": "s14",
    "episode": 1,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Water Me",
      "artist": "Lizzo",
      "raw": "\"Water Me\" — Lizzo"
    },
    "sides": [
      {
        "queens": [
          "june"
        ]
      },
      {
        "queens": [
          "orion"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "june"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "orion"
        ]
      }
    ],
    "notes": "Season premiere sleeper",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 1: June Jambalaya vs. Orion Story — \"Water Me\" (Lizzo)"
    }
  },
  {
    "id": "s14-e02-1",
    "seasonId": "s14",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Fallin'",
      "artist": "Alicia Keys",
      "raw": "\"Fallin'\" — Alicia Keys"
    },
    "sides": [
      {
        "queens": [
          "daya"
        ]
      },
      {
        "queens": [
          "deja"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "deja"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "daya"
        ]
      }
    ],
    "notes": "Daya eliminated first round",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 2: Daya Betty vs. Deja Skye — \"Fallin'\" (Alicia Keys)"
    }
  },
  {
    "id": "s14-e03-1",
    "seasonId": "s14",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "I Love It",
      "artist": "Kylie Minogue",
      "raw": "\"I Love It\" — Kylie Minogue"
    },
    "sides": [
      {
        "queens": [
          "june"
        ]
      },
      {
        "queens": [
          "maddy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "maddy"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "june"
        ]
      }
    ],
    "notes": "Chocolate bar sends June",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 3: June Jambalaya vs. Maddy Morphosis — \"I Love It\" (Kylie Minogue)"
    }
  },
  {
    "id": "s14-e04-1",
    "seasonId": "s14",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Play",
      "artist": "Jennifer Lopez",
      "raw": "\"Play\" — Jennifer Lopez"
    },
    "sides": [
      {
        "queens": [
          "alyssa14"
        ]
      },
      {
        "queens": [
          "kerri"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kerri"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "alyssa14"
        ]
      }
    ],
    "notes": "Alyssa out, Kerri shines",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 4: Alyssa Hunter vs. Kerri Colby — \"Play\" (Jennifer Lopez)"
    }
  },
  {
    "id": "s14-e05-1",
    "seasonId": "s14",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "My Head & My Heart",
      "artist": "Ava Max",
      "raw": "\"My Head & My Heart\" — Ava Max"
    },
    "sides": [
      {
        "queens": [
          "jorgeous"
        ]
      },
      {
        "queens": [
          "orion"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "orion"
        ]
      }
    ],
    "notes": "Jorgeous jumpsplit opener",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 5: Jorgeous vs. Orion Story — \"My Head & My Heart\" (Ava Max)"
    }
  },
  {
    "id": "s14-e06-1",
    "seasonId": "s14",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Suga Mama",
      "artist": "Beyoncé",
      "raw": "\"Suga Mama\" — Beyoncé"
    },
    "sides": [
      {
        "queens": [
          "jasmine"
        ]
      },
      {
        "queens": [
          "maddy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jasmine"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "maddy"
        ]
      }
    ],
    "notes": "Jasmine upstart win",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 6: Jasmine Kennedie vs. Maddy Morphosis — \"Suga Mama\" (Beyoncé)"
    }
  },
  {
    "id": "s14-e07-1",
    "seasonId": "s14",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "One Way or Another",
      "artist": "Blondie",
      "raw": "\"One Way or Another\" — Blondie"
    },
    "sides": [
      {
        "queens": [
          "daya"
        ]
      },
      {
        "queens": [
          "lady"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lady"
        ]
      }
    ],
    "eliminated": [],
    "notes": "No elim, Camden's moment",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 7: Daya Betty vs. Lady Camden — \"One Way or Another\" (Blondie)"
    }
  },
  {
    "id": "s14-e08-1",
    "seasonId": "s14",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Un-Break My Heart (Soul-Hex Radio Mix)",
      "artist": "Toni Braxton",
      "raw": "\"Un-Break My Heart (Soul-Hex Radio Mix)\" — Toni Braxton"
    },
    "sides": [
      {
        "queens": [
          "jasmine"
        ]
      },
      {
        "queens": [
          "kerri"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jasmine"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kerri"
        ]
      }
    ],
    "notes": "Kerri eliminated, emotional",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 8: Jasmine Kennedie vs. Kerri Colby — \"Un-Break My Heart (Soul-Hex Radio Mix)\" (Toni Braxton)"
    }
  },
  {
    "id": "s14-e09-1",
    "seasonId": "s14",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "double_shantay",
    "song": {
      "title": "Something's Got a Hold on Me",
      "artist": "Etta James",
      "raw": "\"Something's Got a Hold on Me\" — Etta James"
    },
    "sides": [
      {
        "queens": [
          "jasmine"
        ]
      },
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jasmine"
        ]
      },
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Double shantay, fierce",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 9: Jasmine Kennedie vs. Jorgeous — \"Something's Got a Hold on Me\" (Etta James)"
    }
  },
  {
    "id": "s14-e11-r1-1",
    "seasonId": "s14",
    "episode": 11,
    "round": "R1",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Respect",
      "artist": "Aretha Franklin",
      "raw": "\"Respect\" — Aretha Franklin"
    },
    "sides": [
      {
        "queens": [
          "jasmine"
        ]
      },
      {
        "queens": [
          "daya"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "daya"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jasmine"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 11: Daya Betty vs. Jasmine Kennedie — \"Respect\" (Aretha Franklin)"
    }
  },
  {
    "id": "s14-e11-r1-2",
    "seasonId": "s14",
    "episode": 11,
    "round": "R1",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Never Too Much",
      "artist": "Luther Vandross",
      "raw": "\"Never Too Much\" — Luther Vandross"
    },
    "sides": [
      {
        "queens": [
          "willow"
        ]
      },
      {
        "queens": [
          "bosco"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "willow"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "bosco"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R1 upset",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 11: Bosco vs. Willow Pill — \"Never Too Much\" (Luther Vandross)"
    }
  },
  {
    "id": "s14-e11-r1-3",
    "seasonId": "s14",
    "episode": 11,
    "round": "R1",
    "sequence": 3,
    "type": "lalaparuza",
    "outcome": "multi_advance",
    "song": {
      "title": "Radio",
      "artist": "Beyoncé",
      "raw": "\"Radio\" — Beyoncé"
    },
    "sides": [
      {
        "queens": [
          "jorgeous"
        ]
      },
      {
        "queens": [
          "angeria"
        ]
      },
      {
        "queens": [
          "lady"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "angeria"
        ]
      },
      {
        "queens": [
          "lady"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R1 three-way",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 11: Angeria Paris VanMicheals vs. Jorgeous vs. Lady Camden — \"Radio\" (Beyoncé)"
    }
  },
  {
    "id": "s14-e11-r2-1",
    "seasonId": "s14",
    "episode": 11,
    "round": "R2",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Don't Let Go (Love)",
      "artist": "En Vogue",
      "raw": "\"Don't Let Go (Love)\" — En Vogue"
    },
    "sides": [
      {
        "queens": [
          "lady"
        ]
      },
      {
        "queens": [
          "bosco"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lady"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "bosco"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R2",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 11: Bosco vs. Lady Camden — \"Don't Let Go (Love)\" (En Vogue)"
    }
  },
  {
    "id": "s14-e11-r2-2",
    "seasonId": "s14",
    "episode": 11,
    "round": "R2",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Love Don't Cost a Thing",
      "artist": "Jennifer Lopez",
      "raw": "\"Love Don't Cost a Thing\" — Jennifer Lopez"
    },
    "sides": [
      {
        "queens": [
          "angeria"
        ]
      },
      {
        "queens": [
          "jasmine"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "angeria"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jasmine"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R2",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 11: Angeria Paris VanMicheals vs. Jasmine Kennedie — \"Love Don't Cost a Thing\" (Jennifer Lopez)"
    }
  },
  {
    "id": "s14-e11-final-1",
    "seasonId": "s14",
    "episode": 11,
    "round": "Final",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Swept Away",
      "artist": "Diana Ross",
      "raw": "\"Swept Away\" — Diana Ross"
    },
    "sides": [
      {
        "queens": [
          "bosco"
        ]
      },
      {
        "queens": [
          "jasmine"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "bosco"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jasmine"
        ]
      }
    ],
    "notes": "LaLaPaRuZa final, Jasmine out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 11: Bosco vs. Jasmine Kennedie — \"Swept Away\" (Diana Ross)"
    }
  },
  {
    "id": "s14-e12-1",
    "seasonId": "s14",
    "episode": 12,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Heartbreak Hotel (Hex Hector Remix)",
      "artist": "Whitney Houston ft. Faith Evans, Kelly Price",
      "raw": "\"Heartbreak Hotel (Hex Hector Remix)\" — Whitney Houston ft. Faith Evans & Kelly Price"
    },
    "sides": [
      {
        "queens": [
          "bosco"
        ]
      },
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Bosco saved via golden bar",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 12: Bosco vs. Jorgeous — \"Heartbreak Hotel (Hex Hector Remix)\" (Whitney Houston ft. Faith Evans, Kelly Price)"
    }
  },
  {
    "id": "s14-e13-1",
    "seasonId": "s14",
    "episode": 13,
    "sequence": 1,
    "type": "regular",
    "outcome": "multi_advance",
    "song": {
      "title": "Good 4 U",
      "artist": "Olivia Rodrigo",
      "raw": "\"Good 4 U\" — Olivia Rodrigo"
    },
    "sides": [
      {
        "queens": [
          "daya"
        ]
      },
      {
        "queens": [
          "deja"
        ]
      },
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "daya"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "deja"
        ]
      },
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "notes": "Three-way, DeJa and Jorgeous out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 13: Daya Betty vs. DeJa Skye vs. Jorgeous — \"Good 4 U\" (Olivia Rodrigo)"
    }
  },
  {
    "id": "s14-e14-1",
    "seasonId": "s14",
    "episode": 14,
    "sequence": 1,
    "type": "regular",
    "outcome": "double_shantay",
    "song": {
      "title": "Telephone",
      "artist": "Lady Gaga ft. Beyoncé",
      "raw": "\"Telephone\" — Lady Gaga ft. Beyoncé"
    },
    "sides": [
      {
        "queens": [
          "angeria"
        ]
      },
      {
        "queens": [
          "willow"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "angeria"
        ]
      },
      {
        "queens": [
          "willow"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Double shantay, Top 5 set",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 14: Angeria Paris VanMicheals vs. Willow Pill — \"Telephone\" (Lady Gaga ft. Beyoncé)"
    }
  },
  {
    "id": "s14-e16-1",
    "seasonId": "s14",
    "episode": 16,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Gimme! Gimme! Gimme! (A Man After Midnight)",
      "artist": "Cher",
      "raw": "\"Gimme! Gimme! Gimme! (A Man After Midnight)\" — Cher"
    },
    "sides": [
      {
        "queens": [
          "lady"
        ]
      },
      {
        "queens": [
          "willow"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "willow"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "lady"
        ]
      }
    ],
    "notes": "Crown lip sync, Willow wins",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_14",
      "revision": 1336156449,
      "sha256": "f38d6491ce3196623da4366fcf5d8c324b79069e0af4d67c26b37ad5d84eb4f1",
      "fetchedAt": "2026-04-21T22:37:34.501Z",
      "quote": "Ep 16: Lady Camden vs. Willow Pill — \"Gimme! Gimme! Gimme! (A Man After Midnight)\" (Cher)"
    }
  },
  {
    "id": "s15-e02-1",
    "seasonId": "s15",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "7 Rings",
      "artist": "Ariana Grande",
      "raw": "\"7 Rings\" — Ariana Grande"
    },
    "sides": [
      {
        "queens": [
          "amethyst"
        ]
      },
      {
        "queens": [
          "irene"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "amethyst"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "irene"
        ]
      }
    ],
    "notes": "Irene eliminated, mess",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 2: Amethyst vs. Irene Dubois — \"7 Rings\" (Ariana Grande)"
    }
  },
  {
    "id": "s15-e03-1",
    "seasonId": "s15",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Ain't No Mountain High Enough (Eric Kupper Remix)",
      "artist": "Diana Ross",
      "raw": "\"Ain't No Mountain High Enough (Eric Kupper Remix)\" — Diana Ross"
    },
    "sides": [
      {
        "queens": [
          "amethyst"
        ]
      },
      {
        "queens": [
          "princess_poppy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "amethyst"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "princess_poppy"
        ]
      }
    ],
    "notes": "Poppy out, Amethyst back-to-back",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 3: Amethyst vs. Princess Poppy — \"Ain't No Mountain High Enough (Eric Kupper Remix)\" (Diana Ross)"
    }
  },
  {
    "id": "s15-e04-1",
    "seasonId": "s15",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "You Better Run",
      "artist": "Pat Benatar",
      "raw": "\"You Better Run\" — Pat Benatar"
    },
    "sides": [
      {
        "queens": [
          "spice"
        ]
      },
      {
        "queens": [
          "sugar"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "spice"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "sugar"
        ]
      }
    ],
    "notes": "Twin showdown, Sugar out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 4: Spice vs. Sugar — \"You Better Run\" (Pat Benatar)"
    }
  },
  {
    "id": "s15-e05-1",
    "seasonId": "s15",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Q.U.E.E.N.",
      "artist": "Janelle Monáe ft. Erykah Badu",
      "raw": "\"Q.U.E.E.N.\" — Janelle Monáe ft. Erykah Badu"
    },
    "sides": [
      {
        "queens": [
          "amethyst"
        ]
      },
      {
        "queens": [
          "salina"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "salina"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "amethyst"
        ]
      }
    ],
    "notes": "Amethyst finally goes",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 5: Amethyst vs. Salina EsTitties — \"Q.U.E.E.N.\" (Janelle Monáe ft. Erykah Badu)"
    }
  },
  {
    "id": "s15-e06-1",
    "seasonId": "s15",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "In Your Room",
      "artist": "The Bangles",
      "raw": "\"In Your Room\" — The Bangles"
    },
    "sides": [
      {
        "queens": [
          "jax"
        ]
      },
      {
        "queens": [
          "robin"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jax"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "robin"
        ]
      }
    ],
    "notes": "Robin eliminated, surprise",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 6: Jax vs. Robin Fierce — \"In Your Room\" (The Bangles)"
    }
  },
  {
    "id": "s15-e07-1",
    "seasonId": "s15",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Sweetest Pie",
      "artist": "Megan Thee Stallion, Dua Lipa",
      "raw": "\"Sweetest Pie\" — Megan Thee Stallion & Dua Lipa"
    },
    "sides": [
      {
        "queens": [
          "aura"
        ]
      },
      {
        "queens": [
          "jax"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jax"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "aura"
        ]
      }
    ],
    "notes": "Aura out, Jax back-to-back",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 7: Aura Mayari vs. Jax — \"Sweetest Pie\" (Megan Thee Stallion, Dua Lipa)"
    }
  },
  {
    "id": "s15-e08-r1-1",
    "seasonId": "s15",
    "episode": 8,
    "round": "R1",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Boys Don't Cry",
      "artist": "Anitta",
      "raw": "\"Boys Don't Cry\" — Anitta"
    },
    "sides": [
      {
        "queens": [
          "malaysia"
        ]
      },
      {
        "queens": [
          "marcia"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "marcia"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "malaysia"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 8: Malaysia Babydoll Foxx vs. Marcia Marcia Marcia — \"Boys Don't Cry\" (Anitta)"
    }
  },
  {
    "id": "s15-e08-r1-2",
    "seasonId": "s15",
    "episode": 8,
    "round": "R1",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Do You Wanna Touch Me (Oh Yeah)",
      "artist": "Joan Jett",
      "raw": "\"Do You Wanna Touch Me\" — Joan Jett"
    },
    "sides": [
      {
        "queens": [
          "loosey"
        ]
      },
      {
        "queens": [
          "spice"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "loosey"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "spice"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R1",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 8: Loosey LaDuca vs. Spice — \"Do You Wanna Touch Me (Oh Yeah)\" (Joan Jett)"
    }
  },
  {
    "id": "s15-e08-r1-3",
    "seasonId": "s15",
    "episode": 8,
    "round": "R1",
    "sequence": 3,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "It's All Coming Back to Me Now",
      "artist": "Céline Dion",
      "raw": "\"It's All Coming Back to Me Now\" — Céline Dion"
    },
    "sides": [
      {
        "queens": [
          "luxx"
        ]
      },
      {
        "queens": [
          "salina"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "salina"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "luxx"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R1 masterclass",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 8: Luxx Noir London vs. Salina EsTitties — \"It's All Coming Back to Me Now\" (Céline Dion)"
    }
  },
  {
    "id": "s15-e08-r1-4",
    "seasonId": "s15",
    "episode": 8,
    "round": "R1",
    "sequence": 4,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Tell It to My Heart",
      "artist": "Taylor Dayne",
      "raw": "\"Tell It to My Heart\" — Taylor Dayne"
    },
    "sides": [
      {
        "queens": [
          "mistress"
        ]
      },
      {
        "queens": [
          "jax"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "mistress"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jax"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 8: Jax vs. Mistress Isabelle Brooks — \"Tell It to My Heart\" (Taylor Dayne)"
    }
  },
  {
    "id": "s15-e08-r1-5",
    "seasonId": "s15",
    "episode": 8,
    "round": "R1",
    "sequence": 5,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "I'm in Love with a Monster",
      "artist": "Fifth Harmony",
      "raw": "\"I'm in Love with a Monster\" — Fifth Harmony"
    },
    "sides": [
      {
        "queens": [
          "anetra"
        ]
      },
      {
        "queens": [
          "sasha_colby"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "sasha_colby"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "anetra"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R1 legendary",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 8: Anetra vs. Sasha Colby — \"I'm in Love with a Monster\" (Fifth Harmony)"
    }
  },
  {
    "id": "s15-e08-r2-1",
    "seasonId": "s15",
    "episode": 8,
    "round": "R2",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Don't Go Yet",
      "artist": "Camila Cabello",
      "raw": "\"Don't Go Yet\" — Camila Cabello"
    },
    "sides": [
      {
        "queens": [
          "malaysia"
        ]
      },
      {
        "queens": [
          "spice"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "malaysia"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "spice"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R2",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 8: Malaysia Babydoll Foxx vs. Spice — \"Don't Go Yet\" (Camila Cabello)"
    }
  },
  {
    "id": "s15-e08-r2-2",
    "seasonId": "s15",
    "episode": 8,
    "round": "R2",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "multi_advance",
    "song": {
      "title": "The Right Stuff",
      "artist": "Vanessa Williams",
      "raw": "\"The Right Stuff\" — Vanessa Williams"
    },
    "sides": [
      {
        "queens": [
          "anetra"
        ]
      },
      {
        "queens": [
          "jax"
        ]
      },
      {
        "queens": [
          "luxx"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "luxx"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "anetra"
        ]
      },
      {
        "queens": [
          "jax"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R2 three-way",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 8: Anetra vs. Jax vs. Luxx Noir London — \"The Right Stuff\" (Vanessa Williams)"
    }
  },
  {
    "id": "s15-e08-final-1",
    "seasonId": "s15",
    "episode": 8,
    "round": "Final",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Finally",
      "artist": "CeCe Peniston",
      "raw": "\"Finally\" — CeCe Peniston"
    },
    "sides": [
      {
        "queens": [
          "anetra"
        ]
      },
      {
        "queens": [
          "jax"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "anetra"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jax"
        ]
      }
    ],
    "notes": "LaLaPaRuZa final, Jax eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 8: Anetra vs. Jax — \"Finally\" (CeCe Peniston)"
    }
  },
  {
    "id": "s15-e09-1",
    "seasonId": "s15",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Thats What I Want",
      "artist": "Lil Nas X",
      "raw": "\"That's What I Want\" — Lil Nas X"
    },
    "sides": [
      {
        "queens": [
          "salina"
        ]
      },
      {
        "queens": [
          "spice"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "salina"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "spice"
        ]
      }
    ],
    "notes": "Spice eliminated",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 9: Salina EsTitties vs. Spice — \"Thats What I Want\" (Lil Nas X)"
    }
  },
  {
    "id": "s15-e10-1",
    "seasonId": "s15",
    "episode": 10,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Single Ladies (Put a Ring on It)",
      "artist": "Beyoncé",
      "raw": "\"Single Ladies (Put a Ring on It)\" — Beyoncé"
    },
    "sides": [
      {
        "queens": [
          "malaysia"
        ]
      },
      {
        "queens": [
          "salina"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "salina"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "malaysia"
        ]
      }
    ],
    "notes": "Malaysia out, Salina thrives",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 10: Malaysia Babydoll Foxx vs. Salina EsTitties — \"Single Ladies (Put a Ring on It)\" (Beyoncé)"
    }
  },
  {
    "id": "s15-e11-1",
    "seasonId": "s15",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Boss Bitch",
      "artist": "Doja Cat",
      "raw": "\"Boss Bitch\" — Doja Cat"
    },
    "sides": [
      {
        "queens": [
          "anetra"
        ]
      },
      {
        "queens": [
          "marcia"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "anetra"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "marcia"
        ]
      }
    ],
    "notes": "Marcia eliminated, duck walk",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 11: Anetra vs. Marcia Marcia Marcia — \"Boss Bitch\" (Doja Cat)"
    }
  },
  {
    "id": "s15-e12-1",
    "seasonId": "s15",
    "episode": 12,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Running Up That Hill (A Deal with God)",
      "artist": "Kate Bush",
      "raw": "\"Running Up That Hill (A Deal with God)\" — Kate Bush"
    },
    "sides": [
      {
        "queens": [
          "loosey"
        ]
      },
      {
        "queens": [
          "salina"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "loosey"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "salina"
        ]
      }
    ],
    "notes": "Salina finally out, emotional",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 12: Loosey LaDuca vs. Salina EsTitties — \"Running Up That Hill (A Deal with God)\" (Kate Bush)"
    }
  },
  {
    "id": "s15-e13-1",
    "seasonId": "s15",
    "episode": 13,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "For the Girls",
      "artist": "Hayley Kiyoko",
      "raw": "\"For the Girls\" — Hayley Kiyoko"
    },
    "sides": [
      {
        "queens": [
          "loosey"
        ]
      },
      {
        "queens": [
          "luxx"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "luxx"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "loosey"
        ]
      }
    ],
    "notes": "Loosey eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 13: Loosey LaDuca vs. Luxx Noir London — \"For the Girls\" (Hayley Kiyoko)"
    }
  },
  {
    "id": "s15-e14-1",
    "seasonId": "s15",
    "episode": 14,
    "sequence": 1,
    "type": "regular",
    "outcome": "double_shantay",
    "song": {
      "title": "When Love Takes Over",
      "artist": "David Guetta ft. Kelly Rowland",
      "raw": "\"When Love Takes Over\" — David Guetta ft. Kelly Rowland"
    },
    "sides": [
      {
        "queens": [
          "anetra"
        ]
      },
      {
        "queens": [
          "mistress"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "anetra"
        ]
      },
      {
        "queens": [
          "mistress"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Double shantay, Top 4 set",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 14: Anetra vs. Mistress Isabelle Brooks — \"When Love Takes Over\" (David Guetta ft. Kelly Rowland)"
    }
  },
  {
    "id": "s15-e16-1",
    "seasonId": "s15",
    "episode": 16,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Knock on Wood",
      "artist": "Amii Stewart",
      "raw": "\"Knock on Wood\" — Amii Stewart"
    },
    "sides": [
      {
        "queens": [
          "anetra"
        ]
      },
      {
        "queens": [
          "sasha_colby"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "sasha_colby"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "anetra"
        ]
      }
    ],
    "notes": "Crown lip sync, Sasha masterclass",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_15",
      "revision": 1343493472,
      "sha256": "3f639e11488df2afbd6e368d9d4b93aaaf0e13e77b8f1485ba898890f0a7b003",
      "fetchedAt": "2026-04-21T22:37:35.050Z",
      "quote": "Ep 16: Anetra vs. Sasha Colby — \"Knock on Wood\" (Amii Stewart)"
    }
  },
  {
    "id": "s16-e01-1",
    "seasonId": "s16",
    "episode": 1,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Break My Soul",
      "artist": "Beyoncé",
      "raw": "\"Break My Soul\" — Beyoncé"
    },
    "sides": [
      {
        "queens": [
          "q"
        ]
      },
      {
        "queens": [
          "sapphira"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "sapphira"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Rate-a-Queen, lip sync for the win",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 1: Q vs. Sapphira Cristál — \"Break My Soul\" (Beyoncé)"
    }
  },
  {
    "id": "s16-e02-1",
    "seasonId": "s16",
    "episode": 2,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Shower",
      "artist": "Becky G",
      "raw": "\"Shower\" — Becky G"
    },
    "sides": [
      {
        "queens": [
          "geneva"
        ]
      },
      {
        "queens": [
          "planejane"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "planejane"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Rate-a-Queen, lip sync for the win",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 2: Geneva Karr vs. Plane Jane — \"Shower\" (Becky G)"
    }
  },
  {
    "id": "s16-e03-1",
    "seasonId": "s16",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Maybe You're the Problem",
      "artist": "Ava Max",
      "raw": "\"Maybe You're the Problem\" — Ava Max"
    },
    "sides": [
      {
        "queens": [
          "geneva"
        ]
      },
      {
        "queens": [
          "hershii"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "geneva"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "hershii"
        ]
      }
    ],
    "notes": "first boot, Hershii sent home",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 3: Geneva Karr vs. Hershii LiqCour-Jeté — \"Maybe You're the Problem\" (Ava Max)"
    }
  },
  {
    "id": "s16-e04-1",
    "seasonId": "s16",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Dark Lady",
      "artist": "Cher",
      "raw": "\"Dark Lady\" — Cher"
    },
    "sides": [
      {
        "queens": [
          "geneva"
        ]
      },
      {
        "queens": [
          "mirage"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "geneva"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mirage"
        ]
      }
    ],
    "notes": "iconic Mirage elimination, buzzy",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 4: Geneva Karr vs. Mirage — \"Dark Lady\" (Cher)"
    }
  },
  {
    "id": "s16-e05-1",
    "seasonId": "s16",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Emergency",
      "artist": "Icona Pop",
      "raw": "\"Emergency\" — Icona Pop"
    },
    "sides": [
      {
        "queens": [
          "amanda"
        ]
      },
      {
        "queens": [
          "q"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "q"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "amanda"
        ]
      }
    ],
    "notes": "ATM goes home, tense",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 5: Amanda Tori Meating vs. Q — \"Emergency\" (Icona Pop)"
    }
  },
  {
    "id": "s16-e06-1",
    "seasonId": "s16",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Control",
      "artist": "Janet Jackson",
      "raw": "\"Control\" — Janet Jackson"
    },
    "sides": [
      {
        "queens": [
          "geneva"
        ]
      },
      {
        "queens": [
          "mhiya"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "mhiya"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "geneva"
        ]
      }
    ],
    "notes": "Mhi'ya flips, Geneva sent home",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 6: Geneva Karr vs. Mhi'ya Iman Le'Paige — \"Control\" (Janet Jackson)"
    }
  },
  {
    "id": "s16-e07-1",
    "seasonId": "s16",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Flowers",
      "artist": "Miley Cyrus",
      "raw": "\"Flowers\" — Miley Cyrus"
    },
    "sides": [
      {
        "queens": [
          "megami"
        ]
      },
      {
        "queens": [
          "mhiya"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "mhiya"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "megami"
        ]
      }
    ],
    "notes": "Megami eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 7: Megami vs. Mhi'ya Iman Le'Paige — \"Flowers\" (Miley Cyrus)"
    }
  },
  {
    "id": "s16-e08-1",
    "seasonId": "s16",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "I Wanna Dance with Somebody (Who Loves Me)",
      "artist": "Whitney Houston",
      "raw": "\"I Wanna Dance with Somebody\" — Whitney Houston"
    },
    "sides": [
      {
        "queens": [
          "morphine"
        ]
      },
      {
        "queens": [
          "xunami"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "morphine"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "xunami"
        ]
      }
    ],
    "notes": "Xunami eliminated, emotional",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 8: Morphine Love Dion vs. Xunami Muse — \"I Wanna Dance with Somebody (Who Loves Me)\" (Whitney Houston)"
    }
  },
  {
    "id": "s16-e09-1",
    "seasonId": "s16",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Bloody Mary (Wednesday Dance TikTok Version)",
      "artist": "Lady Gaga",
      "raw": "\"Bloody Mary (Wednesday TikTok ver.)\" — Lady Gaga"
    },
    "sides": [
      {
        "queens": [
          "mhiya"
        ]
      },
      {
        "queens": [
          "plasma"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "mhiya"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "plasma"
        ]
      }
    ],
    "notes": "Plasma out, gothy number",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 9: Mhi'ya Iman Le'Paige vs. Plasma — \"Bloody Mary (Wednesday Dance TikTok Version)\" (Lady Gaga)"
    }
  },
  {
    "id": "s16-e10-1",
    "seasonId": "s16",
    "episode": 10,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Made You Look",
      "artist": "Meghan Trainor",
      "raw": "\"Made You Look\" — Meghan Trainor"
    },
    "sides": [
      {
        "queens": [
          "morphine"
        ]
      },
      {
        "queens": [
          "sapphira"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "sapphira"
        ]
      }
    ],
    "eliminated": [],
    "notes": "non-elim top-two for the win",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 10: Morphine Love Dion vs. Sapphira Cristál — \"Made You Look\" (Meghan Trainor)"
    }
  },
  {
    "id": "s16-e11-1",
    "seasonId": "s16",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Dim All the Lights",
      "artist": "Donna Summer",
      "raw": "\"Dim All the Lights\" — Donna Summer"
    },
    "sides": [
      {
        "queens": [
          "mhiya"
        ]
      },
      {
        "queens": [
          "morphine"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "morphine"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mhiya"
        ]
      }
    ],
    "notes": "Mhi'ya finally sent home",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 11: Mhi'ya Iman Le'Paige vs. Morphine Love Dion — \"Dim All the Lights\" (Donna Summer)"
    }
  },
  {
    "id": "s16-e12-1",
    "seasonId": "s16",
    "episode": 12,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Body",
      "artist": "Megan Thee Stallion",
      "raw": "\"Body\" — Megan Thee Stallion"
    },
    "sides": [
      {
        "queens": [
          "dawn"
        ]
      },
      {
        "queens": [
          "morphine"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "morphine"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "dawn"
        ]
      }
    ],
    "notes": "Dawn eliminated, top-5 cut",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 12: Dawn vs. Morphine Love Dion — \"Body\" (Megan Thee Stallion)"
    }
  },
  {
    "id": "s16-e13-1",
    "seasonId": "s16",
    "episode": 13,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Miss Me More",
      "artist": "Kelsea Ballerini",
      "raw": "\"Miss Me More\" — Kelsea Ballerini"
    },
    "sides": [
      {
        "queens": [
          "morphine"
        ]
      },
      {
        "queens": [
          "sapphira"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "sapphira"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "morphine"
        ]
      }
    ],
    "notes": "Morphine out, top-4 set",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 13: Morphine Love Dion vs. Sapphira Cristál — \"Miss Me More\" (Kelsea Ballerini)"
    }
  },
  {
    "id": "s16-e14-1",
    "seasonId": "s16",
    "episode": 14,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Better Be Good to Me",
      "artist": "Tina Turner",
      "raw": "\"Better Be Good to Me\" — Tina Turner"
    },
    "sides": [
      {
        "queens": [
          "planejane"
        ]
      },
      {
        "queens": [
          "q"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "planejane"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "q"
        ]
      }
    ],
    "notes": "Q eliminated, top-3 locked",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 14: Plane Jane vs. Q — \"Better Be Good to Me\" (Tina Turner)"
    }
  },
  {
    "id": "s16-e15-lala-1-1",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Damaged",
      "artist": "Danity Kane",
      "raw": "\"Damaged\" — Danity Kane"
    },
    "sides": [
      {
        "queens": [
          "amanda"
        ]
      },
      {
        "queens": [
          "dawn"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "amanda"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "dawn"
        ]
      }
    ],
    "notes": "revenge matchup",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 15: Amanda Tori Meating vs. Dawn — \"Damaged\" (Danity Kane)"
    }
  },
  {
    "id": "s16-e15-lala-2-1",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "2",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "The Shoop Shoop Song",
      "artist": "Cher",
      "raw": "\"The Shoop Shoop Song\" — Cher"
    },
    "sides": [
      {
        "queens": [
          "amanda"
        ]
      },
      {
        "queens": [
          "megami"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "megami"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "amanda"
        ]
      }
    ],
    "notes": "Megami on a streak",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 15: Amanda Tori Meating vs. Megami — \"The Shoop Shoop Song\" (Cher)"
    }
  },
  {
    "id": "s16-e15-lala-1-2",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "What About",
      "artist": "Janet Jackson",
      "raw": "\"What About\" — Janet Jackson"
    },
    "sides": [
      {
        "queens": [
          "megami"
        ]
      },
      {
        "queens": [
          "q"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "megami"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "q"
        ]
      }
    ],
    "notes": "Megami upset",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 15: Megami vs. Q — \"What About\" (Janet Jackson)"
    }
  },
  {
    "id": "s16-e15-lala-2-2",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "2",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "This Time I Know It's for Real",
      "artist": "Donna Summer",
      "raw": "\"This Time I Know It's for Real\" — Donna Summer"
    },
    "sides": [
      {
        "queens": [
          "mirage"
        ]
      },
      {
        "queens": [
          "morphine"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "morphine"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mirage"
        ]
      }
    ],
    "notes": "Morphine rolls on",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 15: Mirage vs. Morphine Love Dion — \"This Time I Know It's for Real\" (Donna Summer)"
    }
  },
  {
    "id": "s16-e15-lala-1-3",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 3,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Million Dollar Baby",
      "artist": "Ava Max",
      "raw": "\"Million Dollar Baby\" — Ava Max"
    },
    "sides": [
      {
        "queens": [
          "geneva"
        ]
      },
      {
        "queens": [
          "morphine"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "morphine"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "geneva"
        ]
      }
    ],
    "notes": "Morphine dominant",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 15: Geneva Karr vs. Morphine Love Dion — \"Million Dollar Baby\" (Ava Max)"
    }
  },
  {
    "id": "s16-e15-lala-2-3",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "2",
    "sequence": 3,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "We Got the Beat",
      "artist": "The Go-Go's",
      "raw": "\"We Got the Beat\" — The Go-Go's"
    },
    "sides": [
      {
        "queens": [
          "megami"
        ]
      },
      {
        "queens": [
          "mhiya"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "megami"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mhiya"
        ]
      }
    ],
    "notes": "Megami advances",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 15: Megami vs. Mhi'ya Iman Le'Paige — \"We Got the Beat\" (The Go-Go's)"
    }
  },
  {
    "id": "s16-e15-lala-1-4",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 4,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Alone 2.0",
      "artist": "Kim Petras, Nicki Minaj",
      "raw": "\"Alone 2.0\" — Kim Petras & Nicki Minaj"
    },
    "sides": [
      {
        "queens": [
          "hershii"
        ]
      },
      {
        "queens": [
          "mirage"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "mirage"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "hershii"
        ]
      }
    ],
    "notes": "Mirage redemption",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 15: Hershii LiqCour-Jeté vs. Mirage — \"Alone 2.0\" (Kim Petras, Nicki Minaj)"
    }
  },
  {
    "id": "s16-e15-lala-1-5",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 5,
    "type": "lalaparuza",
    "outcome": "multi_advance",
    "song": {
      "title": "Milkshake",
      "artist": "Kelis",
      "raw": "\"Milkshake\" — Kelis"
    },
    "sides": [
      {
        "queens": [
          "mhiya"
        ]
      },
      {
        "queens": [
          "plasma"
        ]
      },
      {
        "queens": [
          "xunami"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "mhiya"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "plasma"
        ]
      },
      {
        "queens": [
          "xunami"
        ]
      }
    ],
    "notes": "three-way brawl",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 15: Mhi'ya Iman Le'Paige vs. Plasma vs. Xunami Muse — \"Milkshake\" (Kelis)"
    }
  },
  {
    "id": "s16-e15-lala-final-1",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "Final",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Gonna Make You Sweat (Everybody Dance Now)",
      "artist": "C+C Music Factory",
      "raw": "\"Gonna Make You Sweat\" — C+C Music Factory"
    },
    "sides": [
      {
        "queens": [
          "megami"
        ]
      },
      {
        "queens": [
          "morphine"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "morphine"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "megami"
        ]
      }
    ],
    "notes": "crowned \"Queen of She Done Already Done Had Herses\", $50K",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 15: Megami vs. Morphine Love Dion — \"Gonna Make You Sweat (Everybody Dance Now)\" (C+C Music Factory)"
    }
  },
  {
    "id": "s16-e16-finale-final-1",
    "seasonId": "s16",
    "episode": 16,
    "bracket": "Grand Finale",
    "round": "Final",
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "single_winner",
    "song": {
      "title": "Padam Padam",
      "artist": "Kylie Minogue",
      "raw": "\"Padam Padam\" — Kylie Minogue"
    },
    "sides": [
      {
        "queens": [
          "nymphia"
        ]
      },
      {
        "queens": [
          "sapphira"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "nymphia"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "sapphira"
        ]
      }
    ],
    "notes": "first East Asian winner, banana realness",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_16",
      "revision": 1349988335,
      "sha256": "91eb08ea1eb85d41f2d58eca16879f968a664ad2e2d971f7913a4d58d830c868",
      "fetchedAt": "2026-04-21T22:37:35.571Z",
      "quote": "Ep 16: Nymphia Wind vs. Sapphira Cristál — \"Padam Padam\" (Kylie Minogue)"
    }
  },
  {
    "id": "s17-e01-1",
    "seasonId": "s17",
    "episode": 1,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Woman's World",
      "artist": "Katy Perry",
      "raw": "\"Woman's World\" — Katy Perry"
    },
    "sides": [
      {
        "queens": [
          "jewels"
        ]
      },
      {
        "queens": [
          "suzie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "suzie"
        ]
      }
    ],
    "eliminated": [],
    "notes": "top-two for the win, non-elim",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 1: Jewels Sparkles vs. Suzie Toot — \"Woman's World\" (Katy Perry)"
    }
  },
  {
    "id": "s17-e02-1",
    "seasonId": "s17",
    "episode": 2,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Alter Ego",
      "artist": "Doechii, JT",
      "raw": "\"Alter Ego\" — Doechii & JT"
    },
    "sides": [
      {
        "queens": [
          "crystal17"
        ]
      },
      {
        "queens": [
          "lexi"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lexi"
        ]
      }
    ],
    "eliminated": [],
    "notes": "top-two for the win, non-elim",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 2: Crystal Envy vs. Lexi Love — \"Alter Ego\" (Doechii, JT)"
    }
  },
  {
    "id": "s17-e02-2",
    "seasonId": "s17",
    "episode": 2,
    "sequence": 2,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Yes, And?",
      "artist": "Ariana Grande",
      "raw": "\"Yes, And?\" — Ariana Grande"
    },
    "sides": [
      {
        "queens": [
          "acacia"
        ]
      },
      {
        "queens": [
          "hormona"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "acacia"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Hormona saved by Badonka Dunk",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 2: Acacia Forgot vs. Hormona Lisa — \"Yes, And?\" (Ariana Grande)"
    }
  },
  {
    "id": "s17-e03-1",
    "seasonId": "s17",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "(It's Just) The Way That You Love Me",
      "artist": "Paula Abdul",
      "raw": "\"(It's Just) The Way That You Love Me\" — Paula Abdul"
    },
    "sides": [
      {
        "queens": [
          "joella"
        ]
      },
      {
        "queens": [
          "lucky"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "joella"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "lucky"
        ]
      }
    ],
    "notes": "Lucky eliminated, retro number",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 3: Joella vs. Lucky Starzzz — \"(It's Just) The Way That You Love Me\" (Paula Abdul)"
    }
  },
  {
    "id": "s17-e04-1",
    "seasonId": "s17",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Buttons",
      "artist": "The Pussycat Dolls ft. Snoop Dogg",
      "raw": "\"Buttons\" — Pussycat Dolls ft. Snoop Dogg"
    },
    "sides": [
      {
        "queens": [
          "joella"
        ]
      },
      {
        "queens": [
          "kori"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kori"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "joella"
        ]
      }
    ],
    "notes": "Joella eliminated",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 4: Joella vs. Kori King — \"Buttons\" (The Pussycat Dolls ft. Snoop Dogg)"
    }
  },
  {
    "id": "s17-e05-1",
    "seasonId": "s17",
    "episode": 5,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Boogie Wonderland",
      "artist": "Earth, Wind & Fire, The Emotions",
      "raw": "\"Boogie Wonderland\" — Earth, Wind & Fire & The Emotions"
    },
    "sides": [
      {
        "queens": [
          "arrietty"
        ]
      },
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Arrietty saved by Badonka Dunk",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 5: Arrietty vs. Lydia B Kollins — \"Boogie Wonderland\" (Earth, Wind & Fire, The Emotions)"
    }
  },
  {
    "id": "s17-e06-1",
    "seasonId": "s17",
    "episode": 6,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Get Him Back!",
      "artist": "Olivia Rodrigo",
      "raw": "\"Get Him Back!\" — Olivia Rodrigo"
    },
    "sides": [
      {
        "queens": [
          "hormona"
        ]
      },
      {
        "queens": [
          "lana"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lana"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "hormona"
        ]
      }
    ],
    "notes": "Hormona finally eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 6: Hormona Lisa vs. Lana Ja'Rae — \"Get Him Back!\" (Olivia Rodrigo)"
    }
  },
  {
    "id": "s17-e07-1",
    "seasonId": "s17",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Hands to Myself",
      "artist": "Selena Gomez",
      "raw": "\"Hands to Myself\" — Selena Gomez"
    },
    "sides": [
      {
        "queens": [
          "crystal17"
        ]
      },
      {
        "queens": [
          "lana"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lana"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "crystal17"
        ]
      }
    ],
    "notes": "Crystal eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 7: Crystal Envy vs. Lana Ja'Rae — \"Hands to Myself\" (Selena Gomez)"
    }
  },
  {
    "id": "s17-e08-1",
    "seasonId": "s17",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Wet Dream",
      "artist": "Adam Lambert",
      "raw": "\"Wet Dream\" — Adam Lambert"
    },
    "sides": [
      {
        "queens": [
          "acacia"
        ]
      },
      {
        "queens": [
          "kori"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kori"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "acacia"
        ]
      }
    ],
    "notes": "Acacia sent home",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 8: Acacia Forgot vs. Kori King — \"Wet Dream\" (Adam Lambert)"
    }
  },
  {
    "id": "s17-e09-1",
    "seasonId": "s17",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Kiss Me Deadly",
      "artist": "Lita Ford",
      "raw": "\"Kiss Me Deadly\" — Lita Ford"
    },
    "sides": [
      {
        "queens": [
          "kori"
        ]
      },
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kori"
        ]
      }
    ],
    "notes": "Kori eliminated, rock anthem",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 9: Kori King vs. Lydia B Kollins — \"Kiss Me Deadly\" (Lita Ford)"
    }
  },
  {
    "id": "s17-e10-1",
    "seasonId": "s17",
    "episode": 10,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Ya Ya",
      "artist": "Beyoncé",
      "raw": "\"Ya Ya\" — Beyoncé"
    },
    "sides": [
      {
        "queens": [
          "arrietty"
        ]
      },
      {
        "queens": [
          "jewels"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jewels"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "arrietty"
        ]
      }
    ],
    "notes": "Arrietty eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 10: Arrietty vs. Jewels Sparkles — \"Ya Ya\" (Beyoncé)"
    }
  },
  {
    "id": "s17-e11-1",
    "seasonId": "s17",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Unholy",
      "artist": "Sam Smith, Kim Petras",
      "raw": "\"Unholy\" — Sam Smith & Kim Petras"
    },
    "sides": [
      {
        "queens": [
          "lana"
        ]
      },
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lana"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "notes": "Lydia trapped in garment, out",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 11: Lana Ja'Rae vs. Lydia B Kollins — \"Unholy\" (Sam Smith, Kim Petras)"
    }
  },
  {
    "id": "s17-e12-1",
    "seasonId": "s17",
    "episode": 12,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Illusion",
      "artist": "Dua Lipa",
      "raw": "\"Illusion\" — Dua Lipa"
    },
    "sides": [
      {
        "queens": [
          "lana"
        ]
      },
      {
        "queens": [
          "sam"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "sam"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "lana"
        ]
      }
    ],
    "notes": "Lana eliminated, top-5 cut",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 12: Lana Ja'Rae vs. Sam Star — \"Illusion\" (Dua Lipa)"
    }
  },
  {
    "id": "s17-e13-1",
    "seasonId": "s17",
    "episode": 13,
    "sequence": 1,
    "type": "regular",
    "outcome": "double_shantay",
    "song": {
      "title": "1 Thing",
      "artist": "Amerie",
      "raw": "\"1 Thing\" — Amerie"
    },
    "sides": [
      {
        "queens": [
          "jewels"
        ]
      },
      {
        "queens": [
          "onya"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jewels"
        ]
      },
      {
        "queens": [
          "onya"
        ]
      }
    ],
    "eliminated": [],
    "notes": "no elimination, \"love vibrations\"",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 13: Jewels Sparkles vs. Onya Nurve — \"1 Thing\" (Amerie)"
    }
  },
  {
    "id": "s17-e14-1",
    "seasonId": "s17",
    "episode": 14,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Love Child",
      "artist": "Diana Ross & The Supremes",
      "raw": "\"Love Child\" — Diana Ross & The Supremes"
    },
    "sides": [
      {
        "queens": [
          "sam"
        ]
      },
      {
        "queens": [
          "suzie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "sam"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "suzie"
        ]
      }
    ],
    "notes": "Suzie eliminated, top-4 locked",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 14: Sam Star vs. Suzie Toot — \"Love Child\" (Diana Ross & The Supremes)"
    }
  },
  {
    "id": "s17-e15-lala-1-1",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Say Liza (Liza with a Z)",
      "artist": "Liza Minnelli",
      "raw": "\"Say Liza (Liza with a Z)\" — Liza Minnelli"
    },
    "sides": [
      {
        "queens": [
          "hormona"
        ]
      },
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "hormona"
        ]
      }
    ],
    "notes": "campy kickoff",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 15: Hormona Lisa vs. Lydia B Kollins — \"Say Liza (Liza with a Z)\" (Liza Minnelli)"
    }
  },
  {
    "id": "s17-e15-lala-2-1",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "2",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "We Found Love",
      "artist": "Rihanna ft. Calvin Harris",
      "raw": "\"We Found Love\" — Rihanna ft. Calvin Harris"
    },
    "sides": [
      {
        "queens": [
          "lucky"
        ]
      },
      {
        "queens": [
          "suzie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "suzie"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "lucky"
        ]
      }
    ],
    "notes": "Suzie rolling",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 15: Lucky Starzzz vs. Suzie Toot — \"We Found Love\" (Rihanna ft. Calvin Harris)"
    }
  },
  {
    "id": "s17-e15-lala-1-2",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Training Season",
      "artist": "Dua Lipa",
      "raw": "\"Training Season\" — Dua Lipa"
    },
    "sides": [
      {
        "queens": [
          "joella"
        ]
      },
      {
        "queens": [
          "suzie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "suzie"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "joella"
        ]
      }
    ],
    "notes": "Suzie on fire",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 15: Joella vs. Suzie Toot — \"Training Season\" (Dua Lipa)"
    }
  },
  {
    "id": "s17-e15-lala-2-2",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "2",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "multi_advance",
    "song": {
      "title": "360",
      "artist": "Charli XCX",
      "raw": "\"360\" — Charli XCX"
    },
    "sides": [
      {
        "queens": [
          "kori"
        ]
      },
      {
        "queens": [
          "lana"
        ]
      },
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kori"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "lana"
        ]
      },
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "notes": "three-way brat",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 15: Kori King vs. Lana Ja'Rae vs. Lydia B Kollins — \"360\" (Charli XCX)"
    }
  },
  {
    "id": "s17-e15-lala-1-3",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 3,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Step By Step (Junior Vasquez Tribal X Beats)",
      "artist": "Whitney Houston",
      "raw": "\"Step By Step (Junior Vasquez Mix)\" — Whitney Houston"
    },
    "sides": [
      {
        "queens": [
          "acacia"
        ]
      },
      {
        "queens": [
          "lucky"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lucky"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "acacia"
        ]
      }
    ],
    "notes": "Lucky redemption",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 15: Acacia Forgot vs. Lucky Starzzz — \"Step By Step (Junior Vasquez Tribal X Beats)\" (Whitney Houston)"
    }
  },
  {
    "id": "s17-e15-lala-1-4",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 4,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Blow Me (One Last Kiss)",
      "artist": "P!nk",
      "raw": "\"Blow Me (One Last Kiss)\" — P!nk"
    },
    "sides": [
      {
        "queens": [
          "arrietty"
        ]
      },
      {
        "queens": [
          "kori"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kori"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "arrietty"
        ]
      }
    ],
    "notes": "Kori dominant",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 15: Arrietty vs. Kori King — \"Blow Me (One Last Kiss)\" (P!nk)"
    }
  },
  {
    "id": "s17-e15-lala-1-5",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 5,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "You Make Me Feel (Mighty Real)",
      "artist": "Sylvester",
      "raw": "\"You Make Me Feel (Mighty Real)\" — Sylvester"
    },
    "sides": [
      {
        "queens": [
          "crystal17"
        ]
      },
      {
        "queens": [
          "lana"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lana"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "crystal17"
        ]
      }
    ],
    "notes": "disco anthem",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 15: Crystal Envy vs. Lana Ja'Rae — \"You Make Me Feel (Mighty Real)\" (Sylvester)"
    }
  },
  {
    "id": "s17-e15-lala-final-1",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "Final",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "APT.",
      "artist": "Rosé, Bruno Mars",
      "raw": "\"APT.\" — Rosé & Bruno Mars"
    },
    "sides": [
      {
        "queens": [
          "suzie"
        ]
      },
      {
        "queens": [
          "kori"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "suzie"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kori"
        ]
      }
    ],
    "notes": "crowned \"Queen of She Done Already Done Had Herses\", $50K",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 15: Suzie Toot vs. Kori King — \"APT.\" (Rosé, Bruno Mars)"
    }
  },
  {
    "id": "s17-e16-finale-final-1",
    "seasonId": "s17",
    "episode": 16,
    "bracket": "Grand Finale",
    "round": "Final",
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "single_winner",
    "song": {
      "title": "Abracadabra",
      "artist": "Lady Gaga",
      "raw": "\"Abracadabra\" — Lady Gaga"
    },
    "sides": [
      {
        "queens": [
          "jewels"
        ]
      },
      {
        "queens": [
          "onya"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "onya"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jewels"
        ]
      }
    ],
    "notes": "Onya crowned, gag reveals",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_17",
      "revision": 1350373745,
      "sha256": "1990f9d98d7f27dcf564fa56260c78d4b6ff47c1732cbabec1033416ffdd59b7",
      "fetchedAt": "2026-04-21T22:37:36.151Z",
      "quote": "Ep 16: Jewels Sparkles vs. Onya Nurve — \"Abracadabra\" (Lady Gaga)"
    }
  },
  {
    "id": "s18-e01-1",
    "seasonId": "s18",
    "episode": 1,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Enough (Miami)",
      "artist": "Cardi B",
      "raw": "\"Enough (Miami)\" — Cardi B"
    },
    "sides": [
      {
        "queens": [
          "nini"
        ]
      },
      {
        "queens": [
          "vita"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "nini"
        ]
      }
    ],
    "eliminated": [],
    "notes": "top-two for the win, non-elim",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 1: Nini Coco vs. Vita VonTesse Starr — \"Enough (Miami)\" (Cardi B)"
    }
  },
  {
    "id": "s18-e02-1",
    "seasonId": "s18",
    "episode": 2,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Too Much",
      "artist": "Dove Cameron",
      "raw": "\"Too Much\" — Dove Cameron"
    },
    "sides": [
      {
        "queens": [
          "dd"
        ]
      },
      {
        "queens": [
          "mandy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "mandy"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "dd"
        ]
      }
    ],
    "notes": "DD Fuego first boot",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 2: DD Fuego vs. Mandy Mango — \"Too Much\" (Dove Cameron)"
    }
  },
  {
    "id": "s18-e03-1",
    "seasonId": "s18",
    "episode": 3,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Love in Real Life",
      "artist": "Lizzo",
      "raw": "\"Love in Real Life\" — Lizzo"
    },
    "sides": [
      {
        "queens": [
          "briar"
        ]
      },
      {
        "queens": [
          "mandy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "briar"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mandy"
        ]
      }
    ],
    "notes": "Mandy eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 3: Briar Blush vs. Mandy Mango — \"Love in Real Life\" (Lizzo)"
    }
  },
  {
    "id": "s18-e04-1",
    "seasonId": "s18",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Lights Camera Action",
      "artist": "Kylie Minogue",
      "raw": "\"Lights Camera Action\" — Kylie Minogue"
    },
    "sides": [
      {
        "queens": [
          "briar"
        ]
      },
      {
        "queens": [
          "kenya18"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kenya18"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "briar"
        ]
      }
    ],
    "notes": "Briar eliminated, Kylie moment",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 4: Briar Blush vs. Kenya Pleaser — \"Lights Camera Action\" (Kylie Minogue)"
    }
  },
  {
    "id": "s18-e05-1",
    "seasonId": "s18",
    "episode": 5,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "double_shantay",
    "song": {
      "title": "Pretty Ugly",
      "artist": "Zara Larsson",
      "raw": "\"Pretty Ugly\" — Zara Larsson"
    },
    "sides": [
      {
        "queens": [
          "juicy"
        ]
      },
      {
        "queens": [
          "mia18"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "juicy"
        ]
      },
      {
        "queens": [
          "mia18"
        ]
      }
    ],
    "eliminated": [],
    "notes": "top-two for the win, non-elim",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 5: Juicy Love Dion vs. Mia Starr — \"Pretty Ugly\" (Zara Larsson)"
    }
  },
  {
    "id": "s18-e06-1",
    "seasonId": "s18",
    "episode": 6,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Jerkin'",
      "artist": "Amyl and the Sniffers",
      "raw": "\"Jerkin\" — Amyl & the Sniffers"
    },
    "sides": [
      {
        "queens": [
          "athena"
        ]
      },
      {
        "queens": [
          "jane"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "athena"
        ]
      }
    ],
    "eliminated": [],
    "notes": "top-two for the win, non-elim",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 6: Athena Dion vs. Jane Don't — \"Jerkin'\" (Amyl and the Sniffers)"
    }
  },
  {
    "id": "s18-e06-2",
    "seasonId": "s18",
    "episode": 6,
    "sequence": 2,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Toxic",
      "artist": "Britney Spears",
      "raw": "\"Toxic\" — Britney Spears"
    },
    "sides": [
      {
        "queens": [
          "ciara"
        ]
      },
      {
        "queens": [
          "myki"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "myki"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "ciara"
        ]
      }
    ],
    "notes": "Ciara eliminated, stunty",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 6: Ciara Myst vs. Myki Meeks — \"Toxic\" (Britney Spears)"
    }
  },
  {
    "id": "s18-e07-1",
    "seasonId": "s18",
    "episode": 7,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Houdini",
      "artist": "Dua Lipa",
      "raw": "\"Houdini\" — Dua Lipa"
    },
    "sides": [
      {
        "queens": [
          "juicy"
        ]
      },
      {
        "queens": [
          "vita"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "juicy"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "vita"
        ]
      }
    ],
    "notes": "Vita eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 7: Juicy Love Dion vs. Vita VonTesse Starr — \"Houdini\" (Dua Lipa)"
    }
  },
  {
    "id": "s18-e08-1",
    "seasonId": "s18",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Head Over Heels",
      "artist": "The Go-Go's",
      "raw": "\"Head Over Heels\" — The Go-Go's"
    },
    "sides": [
      {
        "queens": [
          "kenya18"
        ]
      },
      {
        "queens": [
          "mia18"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kenya18"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mia18"
        ]
      }
    ],
    "notes": "Mia Starr eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 8: Kenya Pleaser vs. Mia Starr — \"Head Over Heels\" (The Go-Go's)"
    }
  },
  {
    "id": "s18-e09-1",
    "seasonId": "s18",
    "episode": 9,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Call Me When You Break Up",
      "artist": "Selena Gomez, Benny Blanco, Gracie Abrams",
      "raw": "\"Call Me When You Break Up\" — Selena Gomez, Benny Blanco, Gracie Abrams"
    },
    "sides": [
      {
        "queens": [
          "athena"
        ]
      },
      {
        "queens": [
          "juicy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "juicy"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "athena"
        ]
      }
    ],
    "notes": "Athena eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 9: Athena Dion vs. Juicy Love Dion — \"Call Me When You Break Up\" (Selena Gomez, Benny Blanco, Gracie Abrams)"
    }
  },
  {
    "id": "s18-e10-1",
    "seasonId": "s18",
    "episode": 10,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Feels Like Another One",
      "artist": "Patti LaBelle",
      "raw": "\"Feels Like Another One\" — Patti LaBelle"
    },
    "sides": [
      {
        "queens": [
          "jane"
        ]
      },
      {
        "queens": [
          "kenya18"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jane"
        ]
      }
    ],
    "eliminated": [],
    "notes": "top-two for the win, non-elim",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 10: Jane Don't vs. Kenya Pleaser — \"Feels Like Another One\" (Patti LaBelle)"
    }
  },
  {
    "id": "s18-e11-1",
    "seasonId": "s18",
    "episode": 11,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Total Eclipse of the Heart",
      "artist": "Bonnie Tyler",
      "raw": "\"Total Eclipse of the Heart\" — Bonnie Tyler"
    },
    "sides": [
      {
        "queens": [
          "juicy"
        ]
      },
      {
        "queens": [
          "kenya18"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "juicy"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kenya18"
        ]
      }
    ],
    "notes": "Kenya eliminated, big ballad",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 11: Juicy Love Dion vs. Kenya Pleaser — \"Total Eclipse of the Heart\" (Bonnie Tyler)"
    }
  },
  {
    "id": "s18-e12-1",
    "seasonId": "s18",
    "episode": 12,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "We Can't Be Friends (Wait for Your Love)",
      "artist": "Ariana Grande",
      "raw": "\"We Can't Be Friends (Wait for Your Love)\" — Ariana Grande"
    },
    "sides": [
      {
        "queens": [
          "discord"
        ]
      },
      {
        "queens": [
          "nini"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "nini"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "discord"
        ]
      }
    ],
    "notes": "Discord eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 12: Discord Addams vs. Nini Coco — \"We Can't Be Friends (Wait for Your Love)\" (Ariana Grande)"
    }
  },
  {
    "id": "s18-e13-1",
    "seasonId": "s18",
    "episode": 13,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "Garden of Eden",
      "artist": "Lady Gaga",
      "raw": "\"Garden of Eden\" — Lady Gaga"
    },
    "sides": [
      {
        "queens": [
          "jane"
        ]
      },
      {
        "queens": [
          "nini"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "nini"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jane"
        ]
      }
    ],
    "notes": "Jane Don't eliminated",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 13: Jane Don't vs. Nini Coco — \"Garden of Eden\" (Lady Gaga)"
    }
  },
  {
    "id": "s18-e14-1",
    "seasonId": "s18",
    "episode": 14,
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Super Graphic Ultra Modern Girl",
      "artist": "Chappell Roan",
      "raw": "\"Super Graphic Ultra Modern Girl\" — Chappell Roan"
    },
    "sides": [
      {
        "queens": [
          "juicy"
        ]
      },
      {
        "queens": [
          "nini"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "nini"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "juicy"
        ]
      }
    ],
    "notes": "Juicy eliminated at top 4; returns via Ep 15 Lalaparuza",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 14: Juicy Love Dion vs. Nini Coco — \"Super Graphic Ultra Modern Girl\" (Chappell Roan)"
    }
  },
  {
    "id": "s18-e15-lala-1-1",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Born Naked",
      "artist": "RuPaul ft. Clairy Browne",
      "raw": "\"Born Naked\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "athena"
        ]
      },
      {
        "queens": [
          "ciara"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ciara"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "athena"
        ]
      }
    ],
    "notes": "dueling reveals",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 15: Athena Dion vs. Ciara Myst — \"Born Naked\" (RuPaul ft. Clairy Browne)"
    }
  },
  {
    "id": "s18-e15-lala-2-1",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "2",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Pretty Gang (Ellis Miah Remix)",
      "artist": "RuPaul",
      "raw": "\"Pretty Gang\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "ciara"
        ]
      },
      {
        "queens": [
          "kenya18"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kenya18"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "ciara"
        ]
      }
    ],
    "notes": "Kenya redemption",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 15: Ciara Myst vs. Kenya Pleaser — \"Pretty Gang (Ellis Miah Remix)\" (RuPaul)"
    }
  },
  {
    "id": "s18-e15-lala-1-2",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Sissy That Walk",
      "artist": "RuPaul",
      "raw": "\"Sissy That Walk\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "discord"
        ]
      },
      {
        "queens": [
          "jane"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jane"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "discord"
        ]
      }
    ],
    "notes": "Jane owns the walk",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 15: Discord Addams vs. Jane Don't — \"Sissy That Walk\" (RuPaul)"
    }
  },
  {
    "id": "s18-e15-lala-2-2",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "2",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Call Me Mother",
      "artist": "RuPaul",
      "raw": "\"Call Me Mother\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "mia18"
        ]
      },
      {
        "queens": [
          "vita"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "mia18"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "vita"
        ]
      }
    ],
    "notes": "[added from Wikipedia: research missed this bout]",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 15: Mia Starr vs. Vita VonTesse Starr — \"Call Me Mother\" (RuPaul)"
    }
  },
  {
    "id": "s18-e15-lala-1-3",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 3,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Just What They Want",
      "artist": "RuPaul",
      "raw": "\"Just What They Want\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "mandy"
        ]
      },
      {
        "queens": [
          "mia18"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "mia18"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mandy"
        ]
      }
    ],
    "notes": "[added from Wikipedia: research missed this bout]",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 15: Mandy Mango vs. Mia Starr — \"Just What They Want\" (RuPaul)"
    }
  },
  {
    "id": "s18-e15-lala-1-4",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 4,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Peanut Butter",
      "artist": "RuPaul ft. Big Freedia",
      "raw": "\"Peanut Butter\" — RuPaul ft. Big Freedia"
    },
    "sides": [
      {
        "queens": [
          "kenya18"
        ]
      },
      {
        "queens": [
          "mia18"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "mia18"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kenya18"
        ]
      }
    ],
    "notes": "Mia upsets Kenya",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 15: Kenya Pleaser vs. Mia Starr — \"Peanut Butter\" (RuPaul ft. Big Freedia)"
    }
  },
  {
    "id": "s18-e15-lala-1-5",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "1",
    "sequence": 5,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Main Event",
      "artist": "RuPaul",
      "raw": "\"Main Event\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "dd"
        ]
      },
      {
        "queens": [
          "vita"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "vita"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "dd"
        ]
      }
    ],
    "notes": "[added from Wikipedia: research missed this bout]",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 15: DD Fuego vs. Vita VonTesse Starr — \"Main Event\" (RuPaul)"
    }
  },
  {
    "id": "s18-e15-lala-semi-1",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "Semi",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Cha Cha Bitch",
      "artist": "RuPaul ft. AB Soto",
      "raw": "\"Cha Cha Bitch\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "jane"
        ]
      },
      {
        "queens": [
          "juicy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "juicy"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jane"
        ]
      }
    ],
    "notes": "back-handstand reveal",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 15: Jane Don't vs. Juicy Love Dion — \"Cha Cha Bitch\" (RuPaul ft. AB Soto)"
    }
  },
  {
    "id": "s18-e15-lala-final-1",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "Final",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Cover Girl",
      "artist": "RuPaul",
      "raw": "\"Cover Girl\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "juicy"
        ]
      },
      {
        "queens": [
          "mia18"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "juicy"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mia18"
        ]
      }
    ],
    "notes": "crowned \"Queen of She Done Already Done Had Herses\", $50K, returns to finale",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 15: Juicy Love Dion vs. Mia Starr — \"Cover Girl\" (RuPaul)"
    }
  },
  {
    "id": "s18-e16-finale-final-1",
    "seasonId": "s18",
    "episode": 16,
    "bracket": "Grand Finale",
    "round": "Final",
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "single_winner",
    "song": {
      "title": "Every Girl You've Ever Loved",
      "artist": "Miley Cyrus ft. Naomi Campbell",
      "raw": "\"Every Girl You've Ever Loved\" — Miley Cyrus ft. Naomi Campbell"
    },
    "sides": [
      {
        "queens": [
          "myki"
        ]
      },
      {
        "queens": [
          "nini"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "myki"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "nini"
        ]
      }
    ],
    "notes": "crowned Season 18 winner, $200K + ABH deal",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_season_18",
      "revision": 1350373588,
      "sha256": "f05b9f5849682f55787606cca14563ca5f9ec04a8b63b99249dbaddbe85ceb6e",
      "fetchedAt": "2026-04-21T22:37:36.729Z",
      "quote": "Ep 16: Myki Meeks vs. Nini Coco — \"Every Girl You've Ever Loved\" (Miley Cyrus ft. Naomi Campbell)"
    }
  },
  {
    "id": "as01-e01-1",
    "seasonId": "as01",
    "episode": 1,
    "sequence": 1,
    "type": "team",
    "outcome": "single_winner",
    "song": {
      "title": "Opposites Attract",
      "artist": "Paula Abdul",
      "raw": "\"Opposites Attract\" — Paula Abdul"
    },
    "sides": [
      {
        "queens": [
          "chad"
        ]
      },
      {
        "queens": [
          "mimi"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "chad"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mimi",
          "pandora"
        ],
        "label": "Team Mandora"
      }
    ],
    "notes": "Mimi overpowered, Ru unimpressed",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_1",
      "revision": 1342152831,
      "sha256": "1b19d9486099b9eb43d84a2e4f76566068a9d8cb229986ba5a40edb15c85d0a7",
      "fetchedAt": "2026-04-21T22:37:37.229Z",
      "quote": "Ep 1: Mimi vs. Chad — \"Opposites Attract\" (Paula Abdul)"
    }
  },
  {
    "id": "as01-e02-1",
    "seasonId": "as01",
    "episode": 2,
    "sequence": 1,
    "type": "team",
    "outcome": "single_winner",
    "song": {
      "title": "There's No Business Like Show Business",
      "artist": "Ethel Merman",
      "raw": "\"There's No Business Like Show Business\" — Ethel Merman"
    },
    "sides": [
      {
        "queens": [
          "latrice"
        ]
      },
      {
        "queens": [
          "tammie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "latrice"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "nina_flowers",
          "tammie"
        ],
        "label": "Team Brown Flowers"
      }
    ],
    "notes": "Latrice dominant, Tammie flailing",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_1",
      "revision": 1342152831,
      "sha256": "1b19d9486099b9eb43d84a2e4f76566068a9d8cb229986ba5a40edb15c85d0a7",
      "fetchedAt": "2026-04-21T22:37:37.229Z",
      "quote": "Ep 2: Tammie vs. Latrice — \"There's No Business Like Show Business\" (Ethel Merman)"
    }
  },
  {
    "id": "as01-e03-1",
    "seasonId": "as01",
    "episode": 3,
    "sequence": 1,
    "type": "team",
    "outcome": "single_winner",
    "song": {
      "title": "Nasty",
      "artist": "Janet Jackson",
      "raw": "\"Nasty\" — Janet Jackson"
    },
    "sides": [
      {
        "queens": [
          "jujubee"
        ]
      },
      {
        "queens": [
          "manila"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jujubee"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "latrice",
          "manila"
        ],
        "label": "Team Latrila"
      }
    ],
    "notes": "Juju slays, big team upset",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_1",
      "revision": 1342152831,
      "sha256": "1b19d9486099b9eb43d84a2e4f76566068a9d8cb229986ba5a40edb15c85d0a7",
      "fetchedAt": "2026-04-21T22:37:37.229Z",
      "quote": "Ep 3: Manila vs. Jujubee — \"Nasty\" (Janet Jackson)"
    }
  },
  {
    "id": "as01-e04-1",
    "seasonId": "as01",
    "episode": 4,
    "sequence": 1,
    "type": "team",
    "outcome": "single_winner",
    "song": {
      "title": "Don't Cha",
      "artist": "The Pussycat Dolls ft. Busta Rhymes",
      "raw": "\"Don't Cha\" — The Pussycat Dolls feat. Busta Rhymes"
    },
    "sides": [
      {
        "queens": [
          "raven"
        ]
      },
      {
        "queens": [
          "alexis_mateo"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "raven"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "alexis_mateo",
          "yara"
        ],
        "label": "Team Yarlexis"
      }
    ],
    "notes": "Yara meltdown, tag-in chaos [Wiki: Yara tagged in mid-LS]",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_1",
      "revision": 1342152831,
      "sha256": "1b19d9486099b9eb43d84a2e4f76566068a9d8cb229986ba5a40edb15c85d0a7",
      "fetchedAt": "2026-04-21T22:37:37.229Z",
      "quote": "Ep 4: Raven vs. Alexis, Yara — \"Don't Cha\" (The Pussycat Dolls ft. Busta Rhymes)"
    }
  },
  {
    "id": "as01-e05-1",
    "seasonId": "as01",
    "episode": 5,
    "sequence": 1,
    "type": "team",
    "outcome": "double_shantay",
    "song": {
      "title": "Dancing on My Own",
      "artist": "Robyn",
      "raw": "\"Dancing on My Own\" — Robyn"
    },
    "sides": [
      {
        "queens": [
          "jujubee"
        ]
      },
      {
        "queens": [
          "raven"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jujubee"
        ]
      },
      {
        "queens": [
          "raven"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Rujubee tearful, non-elimination",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_1",
      "revision": 1342152831,
      "sha256": "1b19d9486099b9eb43d84a2e4f76566068a9d8cb229986ba5a40edb15c85d0a7",
      "fetchedAt": "2026-04-21T22:37:37.229Z",
      "quote": "Ep 5: Jujubee vs. Raven — \"Dancing on My Own\" (Robyn)"
    }
  },
  {
    "id": "as01-e06-1",
    "seasonId": "as01",
    "episode": 6,
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "single_winner",
    "song": {
      "title": "Responsitrannity (Matt Pop Remix)",
      "artist": "RuPaul",
      "raw": "\"Responsitrannity (Matt Pop Edit)\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "chad"
        ]
      },
      {
        "queens": [
          "raven"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "chad"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "raven"
        ]
      }
    ],
    "notes": "Finale crowning, Chad wins",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_1",
      "revision": 1342152831,
      "sha256": "1b19d9486099b9eb43d84a2e4f76566068a9d8cb229986ba5a40edb15c85d0a7",
      "fetchedAt": "2026-04-21T22:37:37.229Z",
      "quote": "Ep 6: Chad Michaels vs. Raven — \"Responsitrannity (Matt Pop Remix)\" (RuPaul)"
    }
  },
  {
    "id": "as02-e01-1",
    "seasonId": "as02",
    "episode": 1,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "Shake It Off",
      "artist": "Taylor Swift",
      "raw": "\"Shake It Off\" — Taylor Swift"
    },
    "sides": [
      {
        "queens": [
          "roxxxy"
        ]
      },
      {
        "queens": [
          "tatianna"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "coco"
        ]
      }
    ],
    "notes": "Roxxxy picks weakest, Coco out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_2",
      "revision": 1342152836,
      "sha256": "59e2d90bb165414ceffe339342f4ef5979e1556a1290077aa00036594aa82b1e",
      "fetchedAt": "2026-04-21T22:37:37.735Z",
      "quote": "Ep 1: Roxxxy Andrews vs. Tatianna — \"Shake It Off\" (Taylor Swift)"
    }
  },
  {
    "id": "as02-e02-1",
    "seasonId": "as02",
    "episode": 2,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "Le Freak",
      "artist": "Chic",
      "raw": "\"Le Freak\" — Chic"
    },
    "sides": [
      {
        "queens": [
          "alaska"
        ]
      },
      {
        "queens": [
          "katya"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alaska"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "tatianna"
        ]
      }
    ],
    "notes": "Controversial boot, Alyssa spared",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_2",
      "revision": 1342152836,
      "sha256": "59e2d90bb165414ceffe339342f4ef5979e1556a1290077aa00036594aa82b1e",
      "fetchedAt": "2026-04-21T22:37:37.735Z",
      "quote": "Ep 2: Alaska vs. Katya — \"Le Freak\" (Chic)"
    }
  },
  {
    "id": "as02-e03-1",
    "seasonId": "as02",
    "episode": 3,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "Tell It to My Heart",
      "artist": "Taylor Dayne",
      "raw": "\"Tell It to My Heart\" — Taylor Dayne"
    },
    "sides": [
      {
        "queens": [
          "alyssa"
        ]
      },
      {
        "queens": [
          "detox"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alyssa"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "ginger"
        ]
      }
    ],
    "notes": "Alyssa tongue pops, Ginger out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_2",
      "revision": 1342152836,
      "sha256": "59e2d90bb165414ceffe339342f4ef5979e1556a1290077aa00036594aa82b1e",
      "fetchedAt": "2026-04-21T22:37:37.735Z",
      "quote": "Ep 3: Alyssa Edwards vs. Detox — \"Tell It to My Heart\" (Taylor Dayne)"
    }
  },
  {
    "id": "as02-e04-1",
    "seasonId": "as02",
    "episode": 4,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "Got to Be Real",
      "artist": "Cheryl Lynn",
      "raw": "\"Got to Be Real\" — Cheryl Lynn"
    },
    "sides": [
      {
        "queens": [
          "alaska"
        ]
      },
      {
        "queens": [
          "phiphi"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alaska"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "alyssa"
        ]
      }
    ],
    "notes": "Alaska-Alyssa partner betrayal",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_2",
      "revision": 1342152836,
      "sha256": "59e2d90bb165414ceffe339342f4ef5979e1556a1290077aa00036594aa82b1e",
      "fetchedAt": "2026-04-21T22:37:37.735Z",
      "quote": "Ep 4: Alaska vs. Phi Phi O'Hara — \"Got to Be Real\" (Cheryl Lynn)"
    }
  },
  {
    "id": "as02-e05-1",
    "seasonId": "as02",
    "episode": 5,
    "sequence": 1,
    "type": "legacy",
    "outcome": "tie_with_elim",
    "song": {
      "title": "Shut Up and Drive",
      "artist": "Rihanna",
      "raw": "\"Shut Up and Drive\" — Rihanna"
    },
    "sides": [
      {
        "queens": [
          "alyssa"
        ]
      },
      {
        "queens": [
          "tatianna"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alyssa"
        ]
      },
      {
        "queens": [
          "tatianna"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "phiphi"
        ]
      }
    ],
    "notes": "Revenge twist, Phi Phi ousted",
    "verified": true,
    "flags": [
      "assassin_tie"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_2",
      "revision": 1342152836,
      "sha256": "59e2d90bb165414ceffe339342f4ef5979e1556a1290077aa00036594aa82b1e",
      "fetchedAt": "2026-04-21T22:37:37.735Z",
      "quote": "Ep 5: Alyssa Edwards vs. Tatianna — \"Shut Up and Drive\" (Rihanna)"
    }
  },
  {
    "id": "as02-e06-1",
    "seasonId": "as02",
    "episode": 6,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "Cherry Bomb",
      "artist": "Joan Jett and The Blackhearts",
      "raw": "\"Cherry Bomb\" — Joan Jett & The Blackhearts"
    },
    "sides": [
      {
        "queens": [
          "alaska"
        ]
      },
      {
        "queens": [
          "katya"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alaska"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "tatianna"
        ]
      }
    ],
    "notes": "Tatianna sent home twice",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_2",
      "revision": 1342152836,
      "sha256": "59e2d90bb165414ceffe339342f4ef5979e1556a1290077aa00036594aa82b1e",
      "fetchedAt": "2026-04-21T22:37:37.735Z",
      "quote": "Ep 6: Alaska vs. Katya — \"Cherry Bomb\" (Joan Jett and The Blackhearts)"
    }
  },
  {
    "id": "as02-e07-1",
    "seasonId": "as02",
    "episode": 7,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "Step It Up",
      "artist": "RuPaul ft. Dave Audé",
      "raw": "\"Step It Up\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "detox"
        ]
      },
      {
        "queens": [
          "katya"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "detox"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "alyssa"
        ]
      }
    ],
    "notes": "Alyssa eliminated second time",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_2",
      "revision": 1342152836,
      "sha256": "59e2d90bb165414ceffe339342f4ef5979e1556a1290077aa00036594aa82b1e",
      "fetchedAt": "2026-04-21T22:37:37.735Z",
      "quote": "Ep 7: Detox vs. Katya — \"Step It Up\" (RuPaul ft. Dave Audé)"
    }
  },
  {
    "id": "as02-e08-1",
    "seasonId": "as02",
    "episode": 8,
    "sequence": 1,
    "type": "legacy",
    "outcome": "multi_advance",
    "song": {
      "title": "If I Were Your Woman",
      "artist": "Gladys Knight & the Pips",
      "raw": "\"If I Were Your Woman\" — Gladys Knight & the Pips"
    },
    "sides": [
      {
        "queens": [
          "alaska"
        ]
      },
      {
        "queens": [
          "detox"
        ]
      },
      {
        "queens": [
          "katya"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alaska"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "detox"
        ]
      },
      {
        "queens": [
          "katya"
        ]
      }
    ],
    "notes": "Three-way finale, Alaska wins",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_2",
      "revision": 1342152836,
      "sha256": "59e2d90bb165414ceffe339342f4ef5979e1556a1290077aa00036594aa82b1e",
      "fetchedAt": "2026-04-21T22:37:37.735Z",
      "quote": "Ep 8: Alaska vs. Detox vs. Katya — \"If I Were Your Woman\" (Gladys Knight & the Pips)"
    }
  },
  {
    "id": "as03-e01-1",
    "seasonId": "as03",
    "episode": 1,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "Anaconda",
      "artist": "Nicki Minaj",
      "raw": "\"Anaconda\" — Nicki Minaj"
    },
    "sides": [
      {
        "queens": [
          "bendela"
        ]
      },
      {
        "queens": [
          "aja"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "bendela"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "morgan"
        ]
      }
    ],
    "notes": "Ben comedy wins, Morgan ousted",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_3",
      "revision": 1349174852,
      "sha256": "c12088a1755e6ff354d8933e1892a04ab2cdb6822c4df8fb2efc162ef986c20c",
      "fetchedAt": "2026-04-21T22:37:38.356Z",
      "quote": "Ep 1: Aja vs. BenDeLaCreme — \"Anaconda\" (Nicki Minaj)"
    }
  },
  {
    "id": "as03-e02-1",
    "seasonId": "as03",
    "episode": 2,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "Jump (For My Love)",
      "artist": "The Pointer Sisters",
      "raw": "\"Jump (For My Love)\" — The Pointer Sisters"
    },
    "sides": [
      {
        "queens": [
          "bendela"
        ]
      },
      {
        "queens": [
          "shangela"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shangela"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "thorgy"
        ]
      }
    ],
    "notes": "Thorgy tense, Shangela slays",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_3",
      "revision": 1349174852,
      "sha256": "c12088a1755e6ff354d8933e1892a04ab2cdb6822c4df8fb2efc162ef986c20c",
      "fetchedAt": "2026-04-21T22:37:38.356Z",
      "quote": "Ep 2: BenDeLaCreme vs. Shangela — \"Jump (For My Love)\" (The Pointer Sisters)"
    }
  },
  {
    "id": "as03-e03-1",
    "seasonId": "as03",
    "episode": 3,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "Green Light",
      "artist": "Lorde",
      "raw": "\"Green Light\" — Lorde"
    },
    "sides": [
      {
        "queens": [
          "bendela"
        ]
      },
      {
        "queens": [
          "kennedy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kennedy"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "milk"
        ]
      }
    ],
    "notes": "Kennedy dance clinic, Milk out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_3",
      "revision": 1349174852,
      "sha256": "c12088a1755e6ff354d8933e1892a04ab2cdb6822c4df8fb2efc162ef986c20c",
      "fetchedAt": "2026-04-21T22:37:38.356Z",
      "quote": "Ep 3: BenDeLaCreme vs. Kennedy Davenport — \"Green Light\" (Lorde)"
    }
  },
  {
    "id": "as03-e04-1",
    "seasonId": "as03",
    "episode": 4,
    "sequence": 1,
    "type": "legacy",
    "outcome": "tie_with_elim",
    "song": {
      "title": "I Kissed a Girl",
      "artist": "Katy Perry",
      "raw": "\"I Kissed a Girl\" — Katy Perry"
    },
    "sides": [
      {
        "queens": [
          "bendela"
        ]
      },
      {
        "queens": [
          "shangela"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "bendela"
        ]
      },
      {
        "queens": [
          "shangela"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "chichi"
        ]
      }
    ],
    "notes": "Joint elim, Chi Chi bittersweet",
    "verified": true,
    "flags": [
      "assassin_tie"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_3",
      "revision": 1349174852,
      "sha256": "c12088a1755e6ff354d8933e1892a04ab2cdb6822c4df8fb2efc162ef986c20c",
      "fetchedAt": "2026-04-21T22:37:38.356Z",
      "quote": "Ep 4: BenDeLaCreme vs. Shangela — \"I Kissed a Girl\" (Katy Perry)"
    }
  },
  {
    "id": "as03-e05-1",
    "seasonId": "as03",
    "episode": 5,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "The Boss",
      "artist": "Diana Ross",
      "raw": "\"The Boss\" — Diana Ross"
    },
    "sides": [
      {
        "queens": [
          "bebe"
        ]
      },
      {
        "queens": [
          "trixie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "bebe"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "aja"
        ]
      }
    ],
    "notes": "BeBe is Diana, Aja out",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_3",
      "revision": 1349174852,
      "sha256": "c12088a1755e6ff354d8933e1892a04ab2cdb6822c4df8fb2efc162ef986c20c",
      "fetchedAt": "2026-04-21T22:37:38.356Z",
      "quote": "Ep 5: BeBe Zahara Benet vs. Trixie Mattel — \"The Boss\" (Diana Ross)"
    }
  },
  {
    "id": "as03-e06-1",
    "seasonId": "as03",
    "episode": 6,
    "sequence": 1,
    "type": "legacy",
    "outcome": "self_elimination",
    "song": {
      "title": "Nobody's Supposed to Be Here (Hex Hector Dance Mix)",
      "artist": "Deborah Cox",
      "raw": "\"Nobody's Supposed to Be Here (Hex Hector Mix)\" — Deborah Cox"
    },
    "sides": [
      {
        "queens": [
          "bendela"
        ]
      },
      {
        "queens": [
          "bebe"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "bendela"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "bendela"
        ]
      }
    ],
    "notes": "DeLa self-sashays, shock moment",
    "verified": true,
    "flags": [
      "self_elimination",
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_3",
      "revision": 1349174852,
      "sha256": "c12088a1755e6ff354d8933e1892a04ab2cdb6822c4df8fb2efc162ef986c20c",
      "fetchedAt": "2026-04-21T22:37:38.356Z",
      "quote": "Ep 6: BeBe Zahara Benet vs. BenDeLaCreme — \"Nobody's Supposed to Be Here (Hex Hector Dance Mix)\" (Deborah Cox)"
    }
  },
  {
    "id": "as03-e07-1",
    "seasonId": "as03",
    "episode": 7,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "Freaky Money",
      "artist": "RuPaul ft. Big Freedia",
      "raw": "\"Freaky Money\" — RuPaul feat. Big Freedia"
    },
    "sides": [
      {
        "queens": [
          "shangela"
        ]
      },
      {
        "queens": [
          "trixie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shangela"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "morgan"
        ]
      }
    ],
    "notes": "Shangela fat suit reveal",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_3",
      "revision": 1349174852,
      "sha256": "c12088a1755e6ff354d8933e1892a04ab2cdb6822c4df8fb2efc162ef986c20c",
      "fetchedAt": "2026-04-21T22:37:38.356Z",
      "quote": "Ep 7: Shangela vs. Trixie Mattel — \"Freaky Money\" (RuPaul ft. Big Freedia)"
    }
  },
  {
    "id": "as03-e08-final-1",
    "seasonId": "as03",
    "episode": 8,
    "round": "Final",
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "single_winner",
    "song": {
      "title": "Wrecking Ball",
      "artist": "Miley Cyrus",
      "raw": "\"Wrecking Ball\" — Miley Cyrus"
    },
    "sides": [
      {
        "queens": [
          "kennedy"
        ]
      },
      {
        "queens": [
          "trixie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "trixie"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kennedy"
        ]
      }
    ],
    "notes": "Trixie crowned, upset win",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_3",
      "revision": 1349174852,
      "sha256": "c12088a1755e6ff354d8933e1892a04ab2cdb6822c4df8fb2efc162ef986c20c",
      "fetchedAt": "2026-04-21T22:37:38.356Z",
      "quote": "Ep 8: Kennedy Davenport vs. Trixie Mattel — \"Wrecking Ball\" (Miley Cyrus)"
    }
  },
  {
    "id": "as04-e01-1",
    "seasonId": "as04",
    "episode": 1,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "Emotions",
      "artist": "Mariah Carey",
      "raw": "\"Emotions\" — Mariah Carey"
    },
    "sides": [
      {
        "queens": [
          "monique"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jasminemasters"
        ]
      }
    ],
    "notes": "Whistle tones premiere win",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_4",
      "revision": 1344677400,
      "sha256": "4c727c7499ce068892eb8e78ae80c2acf82a6a0989ee488b1fd707354898f464",
      "fetchedAt": "2026-04-21T22:37:38.869Z",
      "quote": "Ep 1: Monique Heart vs. Trinity the Tuck — \"Emotions\" (Mariah Carey)"
    }
  },
  {
    "id": "as04-e02-1",
    "seasonId": "as04",
    "episode": 2,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "Into You",
      "artist": "Ariana Grande",
      "raw": "\"Into You\" — Ariana Grande"
    },
    "sides": [
      {
        "queens": [
          "monet"
        ]
      },
      {
        "queens": [
          "valentina"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "valentina"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "farrah"
        ]
      }
    ],
    "notes": "Valentina sends Farrah home",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_4",
      "revision": 1344677400,
      "sha256": "4c727c7499ce068892eb8e78ae80c2acf82a6a0989ee488b1fd707354898f464",
      "fetchedAt": "2026-04-21T22:37:38.869Z",
      "quote": "Ep 2: Monét X Change vs. Valentina — \"Into You\" (Ariana Grande)"
    }
  },
  {
    "id": "as04-e03-1",
    "seasonId": "as04",
    "episode": 3,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "How Will I Know",
      "artist": "Whitney Houston",
      "raw": "\"How Will I Know\" — Whitney Houston"
    },
    "sides": [
      {
        "queens": [
          "manila"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "manila"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "gia"
        ]
      }
    ],
    "notes": "Manila eliminates Gia",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_4",
      "revision": 1344677400,
      "sha256": "4c727c7499ce068892eb8e78ae80c2acf82a6a0989ee488b1fd707354898f464",
      "fetchedAt": "2026-04-21T22:37:38.869Z",
      "quote": "Ep 3: Manila Luzon vs. Trinity the Tuck — \"How Will I Know\" (Whitney Houston)"
    }
  },
  {
    "id": "as04-e04-1",
    "seasonId": "as04",
    "episode": 4,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "The Bitch Is Back",
      "artist": "Tina Turner",
      "raw": "\"The Bitch Is Back\" — Tina Turner"
    },
    "sides": [
      {
        "queens": [
          "manila"
        ]
      },
      {
        "queens": [
          "monique"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "monique"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "latrice"
        ]
      }
    ],
    "notes": "Monique's shock upset",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_4",
      "revision": 1344677400,
      "sha256": "4c727c7499ce068892eb8e78ae80c2acf82a6a0989ee488b1fd707354898f464",
      "fetchedAt": "2026-04-21T22:37:38.869Z",
      "quote": "Ep 4: Manila Luzon vs. Monique Heart — \"The Bitch Is Back\" (Tina Turner)"
    }
  },
  {
    "id": "as04-e05-1",
    "seasonId": "as04",
    "episode": 5,
    "sequence": 1,
    "type": "legacy",
    "outcome": "double_shantay",
    "song": {
      "title": "Jump to It",
      "artist": "Aretha Franklin",
      "raw": "\"Jump to It\" — Aretha Franklin"
    },
    "sides": [
      {
        "queens": [
          "manila"
        ]
      },
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "manila"
        ]
      },
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Ru suspends the rules",
    "verified": true,
    "flags": [
      "rules_suspended"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_4",
      "revision": 1344677400,
      "sha256": "4c727c7499ce068892eb8e78ae80c2acf82a6a0989ee488b1fd707354898f464",
      "fetchedAt": "2026-04-21T22:37:38.869Z",
      "quote": "Ep 5: Manila Luzon vs. Monét X Change — \"Jump to It\" (Aretha Franklin)"
    }
  },
  {
    "id": "as04-e06-1",
    "seasonId": "as04",
    "episode": 6,
    "sequence": 1,
    "type": "legacy",
    "outcome": "double_shantay",
    "song": {
      "title": "Sissy That Walk",
      "artist": "RuPaul",
      "raw": "\"Sissy That Walk\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "latrice"
        ]
      },
      {
        "queens": [
          "monique"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "latrice"
        ]
      },
      {
        "queens": [
          "monique"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Latrice re-enters the competition",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_4",
      "revision": 1344677400,
      "sha256": "4c727c7499ce068892eb8e78ae80c2acf82a6a0989ee488b1fd707354898f464",
      "fetchedAt": "2026-04-21T22:37:38.869Z",
      "quote": "Ep 6: Latrice Royale vs. Monique Heart — \"Sissy That Walk\" (RuPaul)"
    }
  },
  {
    "id": "as04-e06-r1-1",
    "seasonId": "as04",
    "episode": 6,
    "round": "R1",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Peanut Butter",
      "artist": "RuPaul ft. Big Freedia",
      "raw": "\"Peanut Butter\" — RuPaul ft. Big Freedia"
    },
    "sides": [
      {
        "queens": [
          "jasminemasters"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jasminemasters"
        ]
      }
    ],
    "notes": "LaLaPaRUza smackdown bout 1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_4",
      "revision": 1344677400,
      "sha256": "4c727c7499ce068892eb8e78ae80c2acf82a6a0989ee488b1fd707354898f464",
      "fetchedAt": "2026-04-21T22:37:38.869Z",
      "quote": "Ep 6: Jasmine Masters vs. Trinity the Tuck — \"Peanut Butter\" (RuPaul ft. Big Freedia)"
    }
  },
  {
    "id": "as04-e06-r2-1",
    "seasonId": "as04",
    "episode": 6,
    "round": "R2",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Kitty Girl",
      "artist": "RuPaul",
      "raw": "\"Kitty Girl\" — RuPaul"
    },
    "sides": [
      {
        "queens": [
          "farrah"
        ]
      },
      {
        "queens": [
          "valentina"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "valentina"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "farrah"
        ]
      }
    ],
    "notes": "Smackdown bout 2",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_4",
      "revision": 1344677400,
      "sha256": "4c727c7499ce068892eb8e78ae80c2acf82a6a0989ee488b1fd707354898f464",
      "fetchedAt": "2026-04-21T22:37:38.869Z",
      "quote": "Ep 6: Farrah Moan vs. Valentina — \"Kitty Girl\" (RuPaul)"
    }
  },
  {
    "id": "as04-e06-r3-1",
    "seasonId": "as04",
    "episode": 6,
    "round": "R3",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Adrenaline",
      "artist": "RuPaul ft. Myah Marie",
      "raw": "\"Adrenaline\" — RuPaul ft. Myah Marie"
    },
    "sides": [
      {
        "queens": [
          "gia"
        ]
      },
      {
        "queens": [
          "naomi"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "naomi"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "gia"
        ]
      }
    ],
    "notes": "Smackdown bout 3",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_4",
      "revision": 1344677400,
      "sha256": "4c727c7499ce068892eb8e78ae80c2acf82a6a0989ee488b1fd707354898f464",
      "fetchedAt": "2026-04-21T22:37:38.869Z",
      "quote": "Ep 6: Gia Gunn vs. Naomi Smalls — \"Adrenaline\" (RuPaul ft. Myah Marie)"
    }
  },
  {
    "id": "as04-e07-1",
    "seasonId": "as04",
    "episode": 7,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "You Spin Me Round (Like a Record)",
      "artist": "Dead or Alive",
      "raw": "\"You Spin Me Round (Like a Record)\" — Dead or Alive"
    },
    "sides": [
      {
        "queens": [
          "latrice"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "latrice"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "valentina"
        ]
      }
    ],
    "notes": "Latrice sends Valentina home",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_4",
      "revision": 1344677400,
      "sha256": "4c727c7499ce068892eb8e78ae80c2acf82a6a0989ee488b1fd707354898f464",
      "fetchedAt": "2026-04-21T22:37:38.869Z",
      "quote": "Ep 7: Latrice Royale vs. Trinity the Tuck — \"You Spin Me Round (Like a Record)\" (Dead or Alive)"
    }
  },
  {
    "id": "as04-e08-1",
    "seasonId": "as04",
    "episode": 8,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "Come Rain or Come Shine",
      "artist": "Judy Garland",
      "raw": "\"Come Rain or Come Shine\" — Judy Garland"
    },
    "sides": [
      {
        "queens": [
          "monet"
        ]
      },
      {
        "queens": [
          "naomi"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "naomi"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "manila"
        ]
      }
    ],
    "notes": "Best Judy's week",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_4",
      "revision": 1344677400,
      "sha256": "4c727c7499ce068892eb8e78ae80c2acf82a6a0989ee488b1fd707354898f464",
      "fetchedAt": "2026-04-21T22:37:38.869Z",
      "quote": "Ep 8: Monét X Change vs. Naomi Smalls — \"Come Rain or Come Shine\" (Judy Garland)"
    }
  },
  {
    "id": "as04-e09-1",
    "seasonId": "as04",
    "episode": 9,
    "sequence": 1,
    "type": "legacy",
    "outcome": "single_winner",
    "song": {
      "title": "When I Think of You",
      "artist": "Janet Jackson",
      "raw": "\"When I Think of You\" — Janet Jackson"
    },
    "sides": [
      {
        "queens": [
          "monique"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "latrice"
        ]
      }
    ],
    "notes": "Trinity cuts Latrice pre-finale",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_4",
      "revision": 1344677400,
      "sha256": "4c727c7499ce068892eb8e78ae80c2acf82a6a0989ee488b1fd707354898f464",
      "fetchedAt": "2026-04-21T22:37:38.869Z",
      "quote": "Ep 9: Monique Heart vs. Trinity the Tuck — \"When I Think of You\" (Janet Jackson)"
    }
  },
  {
    "id": "as04-e10-1",
    "seasonId": "as04",
    "episode": 10,
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "double_shantay",
    "song": {
      "title": "Fighter",
      "artist": "Christina Aguilera",
      "raw": "\"Fighter\" — Christina Aguilera"
    },
    "sides": [
      {
        "queens": [
          "monet"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "monet"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Lip Sync for the Crown; double crown",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_4",
      "revision": 1344677400,
      "sha256": "4c727c7499ce068892eb8e78ae80c2acf82a6a0989ee488b1fd707354898f464",
      "fetchedAt": "2026-04-21T22:37:38.869Z",
      "quote": "Ep 10: Monét X Change vs. Trinity the Tuck — \"Fighter\" (Christina Aguilera)"
    }
  },
  {
    "id": "as05-e01-1",
    "seasonId": "as05",
    "episode": 1,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Livin' la Vida Loca",
      "artist": "Ricky Martin",
      "raw": "\"Livin' la Vida Loca\" — Ricky Martin"
    },
    "sides": [
      {
        "queens": [
          "india"
        ]
      },
      {
        "queens": [
          "yvie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "yvie"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "derrick"
        ]
      }
    ],
    "notes": "Yvie crushes premiere",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_5",
      "revision": 1346192529,
      "sha256": "82dbf64eb18595124cd432f1cd1af46fab3777338bc2dfaf7999ecc2f8308740",
      "fetchedAt": "2026-04-21T22:37:39.429Z",
      "quote": "Ep 1: India Ferrah vs. Yvie Oddly — \"Livin' la Vida Loca\" (Ricky Martin)"
    }
  },
  {
    "id": "as05-e02-1",
    "seasonId": "as05",
    "episode": 2,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Neutron Dance",
      "artist": "The Pointer Sisters",
      "raw": "\"Neutron Dance\" — The Pointer Sisters"
    },
    "sides": [
      {
        "queens": [
          "shea"
        ]
      },
      {
        "queens": [
          "alyssa"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "ongina"
        ]
      }
    ],
    "notes": "Shea beats Alyssa",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_5",
      "revision": 1346192529,
      "sha256": "82dbf64eb18595124cd432f1cd1af46fab3777338bc2dfaf7999ecc2f8308740",
      "fetchedAt": "2026-04-21T22:37:39.429Z",
      "quote": "Ep 2: Shea Couleé vs. Alyssa Edwards — \"Neutron Dance\" (The Pointer Sisters)"
    }
  },
  {
    "id": "as05-e03-1",
    "seasonId": "as05",
    "episode": 3,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Juice",
      "artist": "Lizzo",
      "raw": "\"Juice\" — Lizzo"
    },
    "sides": [
      {
        "queens": [
          "jujubee"
        ]
      },
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mariah"
        ]
      }
    ],
    "notes": "Monét comes for her crown",
    "verified": true,
    "flags": [
      "ambiguous_name_match"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_5",
      "revision": 1346192529,
      "sha256": "82dbf64eb18595124cd432f1cd1af46fab3777338bc2dfaf7999ecc2f8308740",
      "fetchedAt": "2026-04-21T22:37:39.429Z",
      "quote": "Ep 3: Jujubee vs. Monét X Change — \"Juice\" (Lizzo)"
    }
  },
  {
    "id": "as05-e04-1",
    "seasonId": "as05",
    "episode": 4,
    "sequence": 1,
    "type": "assassin",
    "outcome": "tie_with_elim",
    "song": {
      "title": "Where Have You Been",
      "artist": "Rihanna",
      "raw": "\"Where Have You Been\" — Rihanna"
    },
    "sides": [
      {
        "queens": [
          "cracker"
        ]
      },
      {
        "queens": [
          "morgan"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "cracker"
        ]
      },
      {
        "queens": [
          "morgan"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mayhem"
        ]
      }
    ],
    "notes": "Both declared winners; Cracker's lipstick sends Mayhem home",
    "verified": true,
    "flags": [
      "assassin_tie"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_5",
      "revision": 1346192529,
      "sha256": "82dbf64eb18595124cd432f1cd1af46fab3777338bc2dfaf7999ecc2f8308740",
      "fetchedAt": "2026-04-21T22:37:39.429Z",
      "quote": "Ep 4: Miz Cracker vs. Morgan McMichaels — \"Where Have You Been\" (Rihanna)"
    }
  },
  {
    "id": "as05-e05-1",
    "seasonId": "as05",
    "episode": 5,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Open Your Heart",
      "artist": "Madonna",
      "raw": "\"Open Your Heart\" — Madonna"
    },
    "sides": [
      {
        "queens": [
          "shea"
        ]
      },
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "india"
        ]
      }
    ],
    "notes": "Shea shuts down Vanjie",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_5",
      "revision": 1346192529,
      "sha256": "82dbf64eb18595124cd432f1cd1af46fab3777338bc2dfaf7999ecc2f8308740",
      "fetchedAt": "2026-04-21T22:37:39.429Z",
      "quote": "Ep 5: Shea Couleé vs. Vanessa Vanjie Mateo — \"Open Your Heart\" (Madonna)"
    }
  },
  {
    "id": "as05-e06-1",
    "seasonId": "as05",
    "episode": 6,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "One Last Time",
      "artist": "Ariana Grande",
      "raw": "\"One Last Time\" — Ariana Grande"
    },
    "sides": [
      {
        "queens": [
          "cracker"
        ]
      },
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "alexis_mateo"
        ]
      }
    ],
    "notes": "Roxxxy sashay spin drama",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_5",
      "revision": 1346192529,
      "sha256": "82dbf64eb18595124cd432f1cd1af46fab3777338bc2dfaf7999ecc2f8308740",
      "fetchedAt": "2026-04-21T22:37:39.429Z",
      "quote": "Ep 6: Miz Cracker vs. Roxxxy Andrews — \"One Last Time\" (Ariana Grande)"
    }
  },
  {
    "id": "as05-e07-1",
    "seasonId": "as05",
    "episode": 7,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Fancy",
      "artist": "Reba McEntire",
      "raw": "\"Fancy\" — Reba McEntire"
    },
    "sides": [
      {
        "queens": [
          "cracker"
        ]
      },
      {
        "queens": [
          "kennedy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "cracker"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "blair"
        ]
      }
    ],
    "notes": "Cracker's third Legacy",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_5",
      "revision": 1346192529,
      "sha256": "82dbf64eb18595124cd432f1cd1af46fab3777338bc2dfaf7999ecc2f8308740",
      "fetchedAt": "2026-04-21T22:37:39.429Z",
      "quote": "Ep 7: Miz Cracker vs. Kennedy Davenport — \"Fancy\" (Reba McEntire)"
    }
  },
  {
    "id": "as05-e08-1",
    "seasonId": "as05",
    "episode": 8,
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "multi_advance",
    "song": {
      "title": "Make Me Feel",
      "artist": "Janelle Monáe",
      "raw": "\"Make Me Feel\" — Janelle Monáe"
    },
    "sides": [
      {
        "queens": [
          "jujubee"
        ]
      },
      {
        "queens": [
          "cracker"
        ]
      },
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Lip Sync for the Crown finale",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_5",
      "revision": 1346192529,
      "sha256": "82dbf64eb18595124cd432f1cd1af46fab3777338bc2dfaf7999ecc2f8308740",
      "fetchedAt": "2026-04-21T22:37:39.429Z",
      "quote": "Ep 8: Jujubee vs. Miz Cracker vs. Shea Couleé — \"Make Me Feel\" (Janelle Monáe)"
    }
  },
  {
    "id": "as06-e01-1",
    "seasonId": "as06",
    "episode": 1,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Uptown Funk",
      "artist": "Mark Ronson ft. Bruno Mars",
      "raw": "\"Uptown Funk\" — Mark Ronson ft. Bruno Mars"
    },
    "sides": [
      {
        "queens": [
          "yara"
        ]
      },
      {
        "queens": [
          "coco"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "coco"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "serena"
        ]
      }
    ],
    "notes": "Coco returns as assassin",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 1: Yara Sofia vs. Coco Montrese — \"Uptown Funk\" (Mark Ronson ft. Bruno Mars)"
    }
  },
  {
    "id": "as06-e02-1",
    "seasonId": "as06",
    "episode": 2,
    "sequence": 1,
    "type": "assassin",
    "outcome": "tie_with_elim",
    "song": {
      "title": "Miss You Much",
      "artist": "Janet Jackson",
      "raw": "\"Miss You Much\" — Janet Jackson"
    },
    "sides": [
      {
        "queens": [
          "rajah"
        ]
      },
      {
        "queens": [
          "brookelynn"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "rajah"
        ]
      },
      {
        "queens": [
          "brookelynn"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jiggly"
        ]
      }
    ],
    "notes": "Both declared winners; Jiggly sashays",
    "verified": true,
    "flags": [
      "assassin_tie"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 2: Ra'Jah O'Hara vs. Brooke Lynn Hytes — \"Miss You Much\" (Janet Jackson)"
    }
  },
  {
    "id": "as06-e03-1",
    "seasonId": "as06",
    "episode": 3,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Physical",
      "artist": "Dua Lipa",
      "raw": "\"Physical\" — Dua Lipa"
    },
    "sides": [
      {
        "queens": [
          "trinity_bonet"
        ]
      },
      {
        "queens": [
          "laganja"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "laganja"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "notes": "Laganja's redemption moment",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 3: Trinity K. Bonet vs. Laganja Estranja — \"Physical\" (Dua Lipa)"
    }
  },
  {
    "id": "as06-e04-1",
    "seasonId": "as06",
    "episode": 4,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Womanizer",
      "artist": "Britney Spears",
      "raw": "\"Womanizer\" — Britney Spears"
    },
    "sides": [
      {
        "queens": [
          "jan"
        ]
      },
      {
        "queens": [
          "jessica"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jessica"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "yara"
        ]
      }
    ],
    "notes": "Jessica's chaotic clown win",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 4: Jan vs. Jessica Wild — \"Womanizer\" (Britney Spears)"
    }
  },
  {
    "id": "as06-e05-1",
    "seasonId": "as06",
    "episode": 5,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Phone",
      "artist": "Lizzo",
      "raw": "\"Phone\" — Lizzo"
    },
    "sides": [
      {
        "queens": [
          "ginger"
        ]
      },
      {
        "queens": [
          "mayhem"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ginger"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "scarlet"
        ]
      }
    ],
    "notes": "Ginger finally wins a LSFYL",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 5: Ginger Minj vs. Mayhem Miller — \"Phone\" (Lizzo)"
    }
  },
  {
    "id": "as06-e06-1",
    "seasonId": "as06",
    "episode": 6,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Dirrty",
      "artist": "Christina Aguilera ft. Redman",
      "raw": "\"Dirrty\" — Christina Aguilera ft. Redman"
    },
    "sides": [
      {
        "queens": [
          "sonique"
        ]
      },
      {
        "queens": [
          "manila"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "sonique"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "akeria"
        ]
      }
    ],
    "notes": "Kylie beats Manila iconic",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 6: Kylie Sonique Love vs. Manila Luzon — \"Dirrty\" (Christina Aguilera ft. Redman)"
    }
  },
  {
    "id": "as06-e07-1",
    "seasonId": "as06",
    "episode": 7,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Dance Again",
      "artist": "Jennifer Lopez ft. Pitbull",
      "raw": "\"Dance Again\" — Jennifer Lopez ft. Pitbull"
    },
    "sides": [
      {
        "queens": [
          "trinity_bonet"
        ]
      },
      {
        "queens": [
          "alexis_mateo"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alexis_mateo"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jan"
        ]
      }
    ],
    "notes": "Alexis sends Jan home",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 7: Trinity K. Bonet vs. Alexis Mateo — \"Dance Again\" (Jennifer Lopez ft. Pitbull)"
    }
  },
  {
    "id": "as06-e08-1",
    "seasonId": "as06",
    "episode": 8,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Sugar Walls",
      "artist": "Sheena Easton",
      "raw": "\"Sugar Walls\" — Sheena Easton"
    },
    "sides": [
      {
        "queens": [
          "ginger"
        ]
      },
      {
        "queens": [
          "heidi"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ginger"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "pandora"
        ]
      }
    ],
    "notes": "Ginger takes out Pandora",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 8: Ginger Minj vs. Heidi N Closet — \"Sugar Walls\" (Sheena Easton)"
    }
  },
  {
    "id": "as06-e09-1",
    "seasonId": "as06",
    "episode": 9,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Boom Clap",
      "artist": "Charli XCX",
      "raw": "\"Boom Clap\" — Charli XCX"
    },
    "sides": [
      {
        "queens": [
          "rajah"
        ]
      },
      {
        "queens": [
          "kameron"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kameron"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "eureka"
        ]
      }
    ],
    "notes": "Kameron's showstopper",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 9: Ra'Jah O'Hara vs. Kameron Michaels — \"Boom Clap\" (Charli XCX)"
    }
  },
  {
    "id": "as06-e10-1",
    "seasonId": "as06",
    "episode": 10,
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Girls Just Want to Have Fun",
      "artist": "Cyndi Lauper",
      "raw": "\"Girls Just Want to Have Fun\" — Cyndi Lauper"
    },
    "sides": [
      {
        "queens": [
          "jiggly"
        ]
      },
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jiggly"
        ]
      }
    ],
    "notes": "RuDemption bout 2",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 10: Jiggly Caliente vs. Silky Nutmeg Ganache — \"Girls Just Want to Have Fun\" (Cyndi Lauper)"
    }
  },
  {
    "id": "as06-e10-2",
    "seasonId": "as06",
    "episode": 10,
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Point of No Return",
      "artist": "Exposé",
      "raw": "\"Point of No Return\" — Exposé"
    },
    "sides": [
      {
        "queens": [
          "silky"
        ]
      },
      {
        "queens": [
          "yara"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "yara"
        ]
      }
    ],
    "notes": "RuDemption bout 3",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 10: Silky Nutmeg Ganache vs. Yara Sofia — \"Point of No Return\" (Exposé)"
    }
  },
  {
    "id": "as06-e10-3",
    "seasonId": "as06",
    "episode": 10,
    "sequence": 3,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Song for the Lonely",
      "artist": "Cher",
      "raw": "\"Song for the Lonely\" — Cher"
    },
    "sides": [
      {
        "queens": [
          "scarlet"
        ]
      },
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "scarlet"
        ]
      }
    ],
    "notes": "RuDemption bout 4",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 10: Scarlet Envy vs. Silky Nutmeg Ganache — \"Song for the Lonely\" (Cher)"
    }
  },
  {
    "id": "as06-e10-4",
    "seasonId": "as06",
    "episode": 10,
    "sequence": 4,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Heartbreaker",
      "artist": "Pat Benatar",
      "raw": "\"Heartbreaker\" — Pat Benatar"
    },
    "sides": [
      {
        "queens": [
          "jan"
        ]
      },
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jan"
        ]
      }
    ],
    "notes": "RuDemption bout 6",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 10: Jan vs. Silky Nutmeg Ganache — \"Heartbreaker\" (Pat Benatar)"
    }
  },
  {
    "id": "as06-e10-5",
    "seasonId": "as06",
    "episode": 10,
    "sequence": 5,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Focus",
      "artist": "Ariana Grande",
      "raw": "\"Focus\" — Ariana Grande"
    },
    "sides": [
      {
        "queens": [
          "pandora"
        ]
      },
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "pandora"
        ]
      }
    ],
    "notes": "RuDemption bout 7",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 10: Pandora Boxx vs. Silky Nutmeg Ganache — \"Focus\" (Ariana Grande)"
    }
  },
  {
    "id": "as06-e10-6",
    "seasonId": "as06",
    "episode": 10,
    "sequence": 6,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Since U Been Gone",
      "artist": "Kelly Clarkson",
      "raw": "\"Since U Been Gone\" — Kelly Clarkson"
    },
    "sides": [
      {
        "queens": [
          "eureka"
        ]
      },
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "eureka"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "notes": "Eureka wins, re-enters",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 10: Eureka! vs. Silky Nutmeg Ganache — \"Since U Been Gone\" (Kelly Clarkson)"
    }
  },
  {
    "id": "as06-e10-r1-1",
    "seasonId": "as06",
    "episode": 10,
    "round": "R1",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Free Your Mind",
      "artist": "En Vogue",
      "raw": "\"Free Your Mind\" — En Vogue"
    },
    "sides": [
      {
        "queens": [
          "jiggly"
        ]
      },
      {
        "queens": [
          "serena"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jiggly"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "serena"
        ]
      }
    ],
    "notes": "RuDemption Smackdown bout 1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 10: Jiggly Caliente vs. Serena ChaCha — \"Free Your Mind\" (En Vogue)"
    }
  },
  {
    "id": "as06-e11-1",
    "seasonId": "as06",
    "episode": 11,
    "sequence": 1,
    "type": "assassin",
    "outcome": "tie_with_elim",
    "song": {
      "title": "Good Golly, Miss Molly",
      "artist": "Little Richard",
      "raw": "\"Good Golly, Miss Molly\" — Little Richard"
    },
    "sides": [
      {
        "queens": [
          "eureka"
        ]
      },
      {
        "queens": [
          "jaida"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "eureka"
        ]
      },
      {
        "queens": [
          "jaida"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "trinity_bonet"
        ]
      }
    ],
    "notes": "Both declared winners; group + Eureka both chose Trinity",
    "verified": true,
    "flags": [
      "assassin_tie"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 11: Eureka! vs. Jaida Essence Hall — \"Good Golly, Miss Molly\" (Little Richard)"
    }
  },
  {
    "id": "as06-e12-1",
    "seasonId": "as06",
    "episode": 12,
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "multi_advance",
    "song": {
      "title": "Stupid Love",
      "artist": "Lady Gaga",
      "raw": "\"Stupid Love\" — Lady Gaga"
    },
    "sides": [
      {
        "queens": [
          "eureka"
        ]
      },
      {
        "queens": [
          "ginger"
        ]
      },
      {
        "queens": [
          "sonique"
        ]
      },
      {
        "queens": [
          "rajah"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "sonique"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Lip Sync for the Crown finale",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_6",
      "revision": 1342152864,
      "sha256": "7785197d3fdefb31c5043c9c2f6a1726039c6dae32c6e99f3eb31a199cfc2f65",
      "fetchedAt": "2026-04-21T22:37:39.961Z",
      "quote": "Ep 12: Eureka! vs. Ginger Minj vs. Kylie Sonique Love vs. Ra'Jah O'Hara — \"Stupid Love\" (Lady Gaga)"
    }
  },
  {
    "id": "as07-e01-1",
    "seasonId": "as07",
    "episode": 1,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Old MacDonald",
      "artist": "Ella Fitzgerald",
      "raw": "\"Old MacDonald\" — Ella Fitzgerald"
    },
    "sides": [
      {
        "queens": [
          "monet"
        ]
      },
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Shea blocks Trinity",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 1: Monét X Change vs. Shea Couleé — \"Old MacDonald\" (Ella Fitzgerald)"
    }
  },
  {
    "id": "as07-e02-1",
    "seasonId": "as07",
    "episode": 2,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Rumour Has It",
      "artist": "Adele",
      "raw": "\"Rumour Has It\" — Adele"
    },
    "sides": [
      {
        "queens": [
          "jinkx"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jinkx"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Jinkx blocks Shea",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 2: Jinkx Monsoon vs. Trinity the Tuck — \"Rumour Has It\" (Adele)"
    }
  },
  {
    "id": "as07-e03-1",
    "seasonId": "as07",
    "episode": 3,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Green Light",
      "artist": "Beyoncé",
      "raw": "\"Green Light\" — Beyoncé"
    },
    "sides": [
      {
        "queens": [
          "jaida"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jaida"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Jaida blocks Jinkx",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 3: Jaida Essence Hall vs. Trinity the Tuck — \"Green Light\" (Beyoncé)"
    }
  },
  {
    "id": "as07-e04-1",
    "seasonId": "as07",
    "episode": 4,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Love Will Save the Day (Jellybean/David Morales Remix)",
      "artist": "Whitney Houston",
      "raw": "\"Love Will Save the Day (Jellybean & David Morales Remix)\" — Whitney Houston"
    },
    "sides": [
      {
        "queens": [
          "jinkx"
        ]
      },
      {
        "queens": [
          "ext_the_vivienne"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ext_the_vivienne"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Vivienne blocks Monét",
    "verified": true,
    "flags": [
      "external_queen",
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 4: Jinkx Monsoon vs. The Vivienne — \"Love Will Save the Day (Jellybean/David Morales Remix)\" (Whitney Houston)"
    }
  },
  {
    "id": "as07-e05-1",
    "seasonId": "as07",
    "episode": 5,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Better in Color",
      "artist": "Lizzo",
      "raw": "\"Better in Color\" — Lizzo"
    },
    "sides": [
      {
        "queens": [
          "jinkx"
        ]
      },
      {
        "queens": [
          "raja"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jinkx"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Draguation, Jinkx back-to-back",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 5: Jinkx Monsoon vs. Raja — \"Better in Color\" (Lizzo)"
    }
  },
  {
    "id": "as07-e06-1",
    "seasonId": "as07",
    "episode": 6,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Why'd You Come in Here Lookin' Like That",
      "artist": "Dolly Parton",
      "raw": "\"Why'd You Come in Here Lookin' Like That\" — Dolly Parton"
    },
    "sides": [
      {
        "queens": [
          "ext_the_vivienne"
        ]
      },
      {
        "queens": [
          "yvie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ext_the_vivienne"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Night of 1000 Dollys",
    "verified": true,
    "flags": [
      "external_queen"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 6: The Vivienne vs. Yvie Oddly — \"Why'd You Come in Here Lookin' Like That\" (Dolly Parton)"
    }
  },
  {
    "id": "as07-e07-1",
    "seasonId": "as07",
    "episode": 7,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "I Want Love",
      "artist": "Jessie J",
      "raw": "\"I Want Love\" — Jessie J"
    },
    "sides": [
      {
        "queens": [
          "jaida"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Trinity blocks Yvie",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 7: Jaida Essence Hall vs. Trinity the Tuck — \"I Want Love\" (Jessie J)"
    }
  },
  {
    "id": "as07-e08-1",
    "seasonId": "as07",
    "episode": 8,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Super Freak",
      "artist": "Rick James",
      "raw": "\"Super Freak\" — Rick James"
    },
    "sides": [
      {
        "queens": [
          "raja"
        ]
      },
      {
        "queens": [
          "ext_the_vivienne"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "raja"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Raja blocks Jaida",
    "verified": true,
    "flags": [
      "external_queen"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 8: Raja vs. The Vivienne — \"Super Freak\" (Rick James)"
    }
  },
  {
    "id": "as07-e09-1",
    "seasonId": "as07",
    "episode": 9,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "The Night the Lights Went Out in Georgia",
      "artist": "Dixie Carter as Julia Sugarbaker",
      "raw": "\"The Night the Lights Went Out in Georgia\" monologue (Designing Women) — Dixie Carter as Julia Sugarbaker"
    },
    "sides": [
      {
        "queens": [
          "jinkx"
        ]
      },
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "eliminated": [],
    "notes": "First-ever spoken-word LSFYL",
    "verified": true,
    "flags": [
      "monologue"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 9: Jinkx Monsoon vs. Monét X Change — \"The Night the Lights Went Out in Georgia\" (Dixie Carter as Julia Sugarbaker)"
    }
  },
  {
    "id": "as07-e10-1",
    "seasonId": "as07",
    "episode": 10,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Kings & Queens",
      "artist": "Ava Max",
      "raw": "\"Kings & Queens\" — Ava Max"
    },
    "sides": [
      {
        "queens": [
          "jinkx"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jinkx"
        ]
      }
    ],
    "eliminated": [],
    "notes": "No block this week",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 10: Jinkx Monsoon vs. Trinity the Tuck — \"Kings & Queens\" (Ava Max)"
    }
  },
  {
    "id": "as07-e11-1",
    "seasonId": "as07",
    "episode": 11,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Supernova",
      "artist": "Kylie Minogue",
      "raw": "\"Supernova\" — Kylie Minogue"
    },
    "sides": [
      {
        "queens": [
          "monet"
        ]
      },
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Variety show; Monét tiebreaks Trinity in",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 11: Monét X Change vs. Shea Couleé — \"Supernova\" (Kylie Minogue)"
    }
  },
  {
    "id": "as07-e12-herses-r1-1",
    "seasonId": "as07",
    "episode": 12,
    "episodeLabel": "Finale",
    "bracket": "Herses Smackdown",
    "round": "R1",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Push It",
      "artist": "Salt-N-Pepa",
      "raw": "\"Push It\" — Salt-N-Pepa"
    },
    "sides": [
      {
        "queens": [
          "ext_the_vivienne"
        ]
      },
      {
        "queens": [
          "yvie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "yvie"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "ext_the_vivienne"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R1",
    "verified": true,
    "flags": [
      "external_queen"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 12: The Vivienne vs. Yvie Oddly — \"Push It\" (Salt-N-Pepa)"
    }
  },
  {
    "id": "as07-e12-herses-r1-2",
    "seasonId": "as07",
    "episode": 12,
    "episodeLabel": "Finale",
    "bracket": "Herses Smackdown",
    "round": "R1",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Let's Hear It for the Boy",
      "artist": "Deniece Williams",
      "raw": "\"Let's Hear It for the Boy\" — Deniece Williams"
    },
    "sides": [
      {
        "queens": [
          "jaida"
        ]
      },
      {
        "queens": [
          "raja"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "raja"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jaida"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 12: Jaida Essence Hall vs. Raja — \"Let's Hear It for the Boy\" (Deniece Williams)"
    }
  },
  {
    "id": "as07-e12-herses-final-1",
    "seasonId": "as07",
    "episode": 12,
    "episodeLabel": "Finale",
    "bracket": "Herses Smackdown",
    "round": "Final",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Sisters Are Doin' It for Themselves",
      "artist": "Eurythmics, Aretha Franklin",
      "raw": "\"Sisters Are Doin' It for Themselves\" — Eurythmics & Aretha Franklin"
    },
    "sides": [
      {
        "queens": [
          "raja"
        ]
      },
      {
        "queens": [
          "yvie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "raja"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "yvie"
        ]
      }
    ],
    "notes": "Raja = Queen of Herses",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 12: Raja vs. Yvie Oddly — \"Sisters Are Doin' It for Themselves\" (Eurythmics, Aretha Franklin)"
    }
  },
  {
    "id": "as07-e12-qoaq-r1-1",
    "seasonId": "as07",
    "episode": 12,
    "episodeLabel": "Finale",
    "bracket": "Queen of All Queens",
    "round": "R1",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Judas",
      "artist": "Lady Gaga",
      "raw": "\"Judas\" — Lady Gaga"
    },
    "sides": [
      {
        "queens": [
          "jinkx"
        ]
      },
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jinkx"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "shea"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 12: Jinkx Monsoon vs. Shea Couleé — \"Judas\" (Lady Gaga)"
    }
  },
  {
    "id": "as07-e12-qoaq-r1-2",
    "seasonId": "as07",
    "episode": 12,
    "episodeLabel": "Finale",
    "bracket": "Queen of All Queens",
    "round": "R1",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "So What",
      "artist": "P!nk",
      "raw": "\"So What\" — Pink"
    },
    "sides": [
      {
        "queens": [
          "monet"
        ]
      },
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "trinity_taylor"
        ]
      }
    ],
    "notes": "LaLaPaRuZa R1",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 12: Monét X Change vs. Trinity the Tuck — \"So What\" (P!nk)"
    }
  },
  {
    "id": "as07-e12-qoaq-final-1",
    "seasonId": "as07",
    "episode": 12,
    "episodeLabel": "Finale",
    "bracket": "Queen of All Queens",
    "round": "Final",
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "single_winner",
    "song": {
      "title": "Swish Swish",
      "artist": "Katy Perry ft. Nicki Minaj",
      "raw": "\"Swish Swish\" — Katy Perry ft. Nicki Minaj"
    },
    "sides": [
      {
        "queens": [
          "jinkx"
        ]
      },
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jinkx"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "monet"
        ]
      }
    ],
    "notes": "Jinkx crowned Queen of All Queens",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_7",
      "revision": 1342152874,
      "sha256": "5c605e24f0f334ced4f900d6b8809f38cee98c8dbe1cee5bd3874dc7eeaae2ff",
      "fetchedAt": "2026-04-21T22:37:40.531Z",
      "quote": "Ep 12: Jinkx Monsoon vs. Monét X Change — \"Swish Swish\" (Katy Perry ft. Nicki Minaj)"
    }
  },
  {
    "id": "as08-e01-1",
    "seasonId": "as08",
    "episode": 1,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Freakum Dress",
      "artist": "Beyoncé",
      "raw": "\"Freakum Dress\" — Beyoncé"
    },
    "sides": [
      {
        "queens": [
          "kahanna"
        ]
      },
      {
        "queens": [
          "aja"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "aja"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "monica"
        ]
      }
    ],
    "notes": "Aja slays, group pick",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_8",
      "revision": 1342152882,
      "sha256": "a7db69ad2e33c68adc1ca2b31bef3b1004d08ed8ed22232d172477d4bad95803",
      "fetchedAt": "2026-04-21T22:37:41.046Z",
      "quote": "Ep 1: Kahanna Montrese vs. Aja — \"Freakum Dress\" (Beyoncé)"
    }
  },
  {
    "id": "as08-e02-1",
    "seasonId": "as08",
    "episode": 2,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "She Bop",
      "artist": "Cyndi Lauper",
      "raw": "\"She Bop\" — Cyndi Lauper"
    },
    "sides": [
      {
        "queens": [
          "ext_jimbo"
        ]
      },
      {
        "queens": [
          "ext_pangina_heals"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ext_pangina_heals"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "naysha"
        ]
      }
    ],
    "notes": "Pangina takes the $10K",
    "verified": true,
    "flags": [
      "external_queen"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_8",
      "revision": 1342152882,
      "sha256": "a7db69ad2e33c68adc1ca2b31bef3b1004d08ed8ed22232d172477d4bad95803",
      "fetchedAt": "2026-04-21T22:37:41.046Z",
      "quote": "Ep 2: Jimbo vs. Pangina Heals — \"She Bop\" (Cyndi Lauper)"
    }
  },
  {
    "id": "as08-e03-1",
    "seasonId": "as08",
    "episode": 3,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Coconuts",
      "artist": "Kim Petras",
      "raw": "\"Coconuts\" — Kim Petras"
    },
    "sides": [
      {
        "queens": [
          "jessica"
        ]
      },
      {
        "queens": [
          "rajah"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jessica"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mrskasha"
        ]
      }
    ],
    "notes": "Jessica beats the assassin",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_8",
      "revision": 1342152882,
      "sha256": "a7db69ad2e33c68adc1ca2b31bef3b1004d08ed8ed22232d172477d4bad95803",
      "fetchedAt": "2026-04-21T22:37:41.046Z",
      "quote": "Ep 3: Jessica Wild vs. Ra'Jah O'Hara — \"Coconuts\" (Kim Petras)"
    }
  },
  {
    "id": "as08-e04-1",
    "seasonId": "as08",
    "episode": 4,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Bad Reputation",
      "artist": "Joan Jett",
      "raw": "\"Bad Reputation\" — Joan Jett"
    },
    "sides": [
      {
        "queens": [
          "ext_jimbo"
        ]
      },
      {
        "queens": [
          "shannel"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shannel"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "darienne"
        ]
      }
    ],
    "notes": "Season 1 Shannel returns",
    "verified": true,
    "flags": [
      "external_queen"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_8",
      "revision": 1342152882,
      "sha256": "a7db69ad2e33c68adc1ca2b31bef3b1004d08ed8ed22232d172477d4bad95803",
      "fetchedAt": "2026-04-21T22:37:41.046Z",
      "quote": "Ep 4: Jimbo vs. Shannel — \"Bad Reputation\" (Joan Jett)"
    }
  },
  {
    "id": "as08-e05-1",
    "seasonId": "as08",
    "episode": 5,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Hallucinate",
      "artist": "Dua Lipa",
      "raw": "\"Hallucinate\" — Dua Lipa"
    },
    "sides": [
      {
        "queens": [
          "ext_jimbo"
        ]
      },
      {
        "queens": [
          "jasmine"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jasmine"
        ]
      }
    ],
    "eliminated": [],
    "notes": "No elim after Heidi exits",
    "verified": true,
    "flags": [
      "external_queen"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_8",
      "revision": 1342152882,
      "sha256": "a7db69ad2e33c68adc1ca2b31bef3b1004d08ed8ed22232d172477d4bad95803",
      "fetchedAt": "2026-04-21T22:37:41.046Z",
      "quote": "Ep 5: Jimbo vs. Jasmine Kennedie — \"Hallucinate\" (Dua Lipa)"
    }
  },
  {
    "id": "as08-e06-1",
    "seasonId": "as08",
    "episode": 6,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "I'm Not Perfect (But I'm Perfect for You)",
      "artist": "Grace Jones",
      "raw": "\"I'm Not Perfect (But I'm Perfect for You)\" — Grace Jones"
    },
    "sides": [
      {
        "queens": [
          "kandy_muse"
        ]
      },
      {
        "queens": [
          "angeria"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "kandy_muse"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jaymes"
        ]
      }
    ],
    "notes": "Kandy beats the assassin",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_8",
      "revision": 1342152882,
      "sha256": "a7db69ad2e33c68adc1ca2b31bef3b1004d08ed8ed22232d172477d4bad95803",
      "fetchedAt": "2026-04-21T22:37:41.046Z",
      "quote": "Ep 6: Kandy Muse vs. Angeria Paris VanMicheals — \"I'm Not Perfect (But I'm Perfect for You)\" (Grace Jones)"
    }
  },
  {
    "id": "as08-e07-1",
    "seasonId": "as08",
    "episode": 7,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "About Damn Time",
      "artist": "Lizzo",
      "raw": "\"About Damn Time\" — Lizzo"
    },
    "sides": [
      {
        "queens": [
          "lala"
        ]
      },
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lala"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kahanna"
        ]
      }
    ],
    "notes": "LaLa upsets Jorgeous",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_8",
      "revision": 1342152882,
      "sha256": "a7db69ad2e33c68adc1ca2b31bef3b1004d08ed8ed22232d172477d4bad95803",
      "fetchedAt": "2026-04-21T22:37:41.046Z",
      "quote": "Ep 7: LaLa Ri vs. Jorgeous — \"About Damn Time\" (Lizzo)"
    }
  },
  {
    "id": "as08-e08-1",
    "seasonId": "as08",
    "episode": 8,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "These Boots Are Made for Walkin'",
      "artist": "Nancy Sinatra",
      "raw": "\"These Boots Are Made for Walkin'\" — Nancy Sinatra"
    },
    "sides": [
      {
        "queens": [
          "alexis_michelle"
        ]
      },
      {
        "queens": [
          "nicky"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "alexis_michelle"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "lala"
        ]
      }
    ],
    "notes": "Alexis wins her first",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_8",
      "revision": 1342152882,
      "sha256": "a7db69ad2e33c68adc1ca2b31bef3b1004d08ed8ed22232d172477d4bad95803",
      "fetchedAt": "2026-04-21T22:37:41.046Z",
      "quote": "Ep 8: Alexis Michelle vs. Nicky Doll — \"These Boots Are Made for Walkin'\" (Nancy Sinatra)"
    }
  },
  {
    "id": "as08-e09-1",
    "seasonId": "as08",
    "episode": 9,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Freak-A-Zoid",
      "artist": "Midnight Star",
      "raw": "\"Freak-A-Zoid\" — Midnight Star"
    },
    "sides": [
      {
        "queens": [
          "ext_jimbo"
        ]
      },
      {
        "queens": [
          "silky"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ext_jimbo"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "alexis_michelle"
        ]
      }
    ],
    "notes": "Format shift; top picks elim",
    "verified": true,
    "flags": [
      "external_queen"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_8",
      "revision": 1342152882,
      "sha256": "a7db69ad2e33c68adc1ca2b31bef3b1004d08ed8ed22232d172477d4bad95803",
      "fetchedAt": "2026-04-21T22:37:41.046Z",
      "quote": "Ep 9: Jimbo vs. Silky Nutmeg Ganache — \"Freak-A-Zoid\" (Midnight Star)"
    }
  },
  {
    "id": "as08-e10-1",
    "seasonId": "as08",
    "episode": 10,
    "sequence": 1,
    "type": "assassin",
    "outcome": "single_winner",
    "song": {
      "title": "Jumpin', Jumpin'",
      "artist": "Destiny's Child",
      "raw": "\"Jumpin', Jumpin'\" — Destiny's Child"
    },
    "sides": [
      {
        "queens": [
          "kandy_muse"
        ]
      },
      {
        "queens": [
          "ext_priyanka"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ext_priyanka"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jessica"
        ]
      }
    ],
    "notes": "Tie vote; Kandy tiebreaks",
    "verified": true,
    "flags": [
      "external_queen"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_8",
      "revision": 1342152882,
      "sha256": "a7db69ad2e33c68adc1ca2b31bef3b1004d08ed8ed22232d172477d4bad95803",
      "fetchedAt": "2026-04-21T22:37:41.046Z",
      "quote": "Ep 10: Kandy Muse vs. Priyanka — \"Jumpin', Jumpin'\" (Destiny's Child)"
    }
  },
  {
    "id": "as08-e11-1",
    "seasonId": "as08",
    "episode": 11,
    "sequence": 1,
    "type": "assassin",
    "outcome": "double_shantay",
    "song": {
      "title": "Rain on Me",
      "artist": "Lady Gaga, Ariana Grande",
      "raw": "\"Rain on Me\" — Lady Gaga & Ariana Grande"
    },
    "sides": [
      {
        "queens": [
          "jaymes"
        ]
      },
      {
        "queens": [
          "lala"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jaymes"
        ]
      },
      {
        "queens": [
          "lala"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Multiplier wheel; LaLa 3x",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_8",
      "revision": 1342152882,
      "sha256": "a7db69ad2e33c68adc1ca2b31bef3b1004d08ed8ed22232d172477d4bad95803",
      "fetchedAt": "2026-04-21T22:37:41.046Z",
      "quote": "Ep 11: Jaymes Mansfield vs. LaLa Ri — \"Rain on Me\" (Lady Gaga, Ariana Grande)"
    }
  },
  {
    "id": "as08-e12-1",
    "seasonId": "as08",
    "episode": 12,
    "episodeLabel": "Finale",
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "single_winner",
    "song": {
      "title": "Do Ya Wanna Funk",
      "artist": "Sylvester, Patrick Cowley",
      "raw": "\"Do Ya Wanna Funk\" — Sylvester & Patrick Cowley"
    },
    "sides": [
      {
        "queens": [
          "ext_jimbo"
        ]
      },
      {
        "queens": [
          "kandy_muse"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ext_jimbo"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kandy_muse"
        ]
      }
    ],
    "notes": "Jimbo crowned AS8 winner",
    "verified": true,
    "flags": [
      "external_queen",
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_8",
      "revision": 1342152882,
      "sha256": "a7db69ad2e33c68adc1ca2b31bef3b1004d08ed8ed22232d172477d4bad95803",
      "fetchedAt": "2026-04-21T22:37:41.046Z",
      "quote": "Ep 12: Jimbo vs. Kandy Muse — \"Do Ya Wanna Funk\" (Sylvester, Patrick Cowley)"
    }
  },
  {
    "id": "as09-e01-1",
    "seasonId": "as09",
    "episode": 1,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Million Dollar Bill (Freemasons Radio Mix)",
      "artist": "Whitney Houston",
      "raw": "\"Million Dollar Bill (Freemasons Radio Mix)\" — Whitney Houston"
    },
    "sides": [
      {
        "queens": [
          "angeria"
        ]
      },
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "angeria"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Angeria cuts off Roxxxy",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 1: Angeria Paris VanMicheals vs. Jorgeous — \"Million Dollar Bill (Freemasons Radio Mix)\" (Whitney Houston)"
    }
  },
  {
    "id": "as09-e02-1",
    "seasonId": "as09",
    "episode": 2,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Jump in the Line (Shake, Senora)",
      "artist": "Harry Belafonte",
      "raw": "\"Jump in the Line\" — Harry Belafonte"
    },
    "sides": [
      {
        "queens": [
          "gottmik"
        ]
      },
      {
        "queens": [
          "plastique"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "gottmik"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Gottmik cuts off Angeria",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 2: Gottmik vs. Plastique Tiara — \"Jump in the Line (Shake, Senora)\" (Harry Belafonte)"
    }
  },
  {
    "id": "as09-e03-1",
    "seasonId": "as09",
    "episode": 3,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Banana",
      "artist": "Anitta ft. Becky G",
      "raw": "\"Banana\" — Anitta ft. Becky G"
    },
    "sides": [
      {
        "queens": [
          "gottmik"
        ]
      },
      {
        "queens": [
          "nina11"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "gottmik"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Snatch Game; Gottmik back-to-back",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 3: Gottmik vs. Nina West — \"Banana\" (Anitta ft. Becky G)"
    }
  },
  {
    "id": "as09-e04-1",
    "seasonId": "as09",
    "episode": 4,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "double_shantay",
    "song": {
      "title": "Black Cat",
      "artist": "Janet Jackson",
      "raw": "\"Black Cat\" — Janet Jackson"
    },
    "sides": [
      {
        "queens": [
          "roxxxy"
        ]
      },
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "roxxxy"
        ]
      },
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "eliminated": [],
    "notes": "First double-win; joint cut-off of Angeria",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 4: Roxxxy Andrews vs. Vanessa Vanjie — \"Black Cat\" (Janet Jackson)"
    }
  },
  {
    "id": "as09-e05-1",
    "seasonId": "as09",
    "episode": 5,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Super Freaky Girl",
      "artist": "Nicki Minaj",
      "raw": "\"Super Freaky Girl\" — Nicki Minaj"
    },
    "sides": [
      {
        "queens": [
          "plastique"
        ]
      },
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Roxxxy cuts off Gottmik",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 5: Plastique Tiara vs. Roxxxy Andrews — \"Super Freaky Girl\" (Nicki Minaj)"
    }
  },
  {
    "id": "as09-e06-1",
    "seasonId": "as09",
    "episode": 6,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Be My Lover",
      "artist": "La Bouche",
      "raw": "\"Be My Lover\" — La Bouche"
    },
    "sides": [
      {
        "queens": [
          "angeria"
        ]
      },
      {
        "queens": [
          "plastique"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "angeria"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Angeria cuts off Roxxxy",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 6: Angeria Paris VanMicheals vs. Plastique Tiara — \"Be My Lover\" (La Bouche)"
    }
  },
  {
    "id": "as09-e07-1",
    "seasonId": "as09",
    "episode": 7,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Lovergirl",
      "artist": "Teena Marie",
      "raw": "\"Lovergirl\" — Teena Marie"
    },
    "sides": [
      {
        "queens": [
          "angeria"
        ]
      },
      {
        "queens": [
          "nina11"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "angeria"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Angeria cuts off Gottmik",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 7: Angeria Paris VanMicheals vs. Nina West — \"Lovergirl\" (Teena Marie)"
    }
  },
  {
    "id": "as09-e08-1",
    "seasonId": "as09",
    "episode": 8,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "No One Gets the Prize",
      "artist": "Diana Ross",
      "raw": "\"No One Gets the Prize\" — Diana Ross"
    },
    "sides": [
      {
        "queens": [
          "plastique"
        ]
      },
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Last cut-off of the season",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 8: Plastique Tiara vs. Roxxxy Andrews — \"No One Gets the Prize\" (Diana Ross)"
    }
  },
  {
    "id": "as09-e09-1",
    "seasonId": "as09",
    "episode": 9,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "double_shantay",
    "song": {
      "title": "Love Come Home (Subgroovers Music Video Edit)",
      "artist": "Kristine W",
      "raw": "\"Love Come Home (Subgroovers Music Video Edit)\" — Kristine W"
    },
    "sides": [
      {
        "queens": [
          "jorgeous"
        ]
      },
      {
        "queens": [
          "shannel"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jorgeous"
        ]
      },
      {
        "queens": [
          "shannel"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Rosemarie's Rusical; gift badges to each other",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 9: Jorgeous vs. Shannel — \"Love Come Home (Subgroovers Music Video Edit)\" (Kristine W)"
    }
  },
  {
    "id": "as09-e10-1",
    "seasonId": "as09",
    "episode": 10,
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "My Lovin' (You're Never Gonna Get It)",
      "artist": "En Vogue",
      "raw": "\"My Lovin' (You're Never Gonna Get It)\" — En Vogue"
    },
    "sides": [
      {
        "queens": [
          "angeria"
        ]
      },
      {
        "queens": [
          "gottmik"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "angeria"
        ]
      }
    ],
    "eliminated": [],
    "notes": "R1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 10: Angeria Paris VanMicheals vs. Gottmik — \"My Lovin' (You're Never Gonna Get It)\" (En Vogue)"
    }
  },
  {
    "id": "as09-e10-2",
    "seasonId": "as09",
    "episode": 10,
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Break Free",
      "artist": "Ariana Grande ft. Zedd",
      "raw": "\"Break Free\" — Ariana Grande ft. Zedd"
    },
    "sides": [
      {
        "queens": [
          "roxxxy"
        ]
      },
      {
        "queens": [
          "shannel"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Roxxxy earns badges via Smackdown",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 10: Roxxxy Andrews vs. Shannel — \"Break Free\" (Ariana Grande ft. Zedd)"
    }
  },
  {
    "id": "as09-e10-r1-1",
    "seasonId": "as09",
    "episode": 10,
    "round": "R1",
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "When I Grow Up",
      "artist": "The Pussycat Dolls",
      "raw": "\"When I Grow Up\" — The Pussycat Dolls"
    },
    "sides": [
      {
        "queens": [
          "plastique"
        ]
      },
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "eliminated": [],
    "notes": "R1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 10: Plastique Tiara vs. Vanessa Vanjie — \"When I Grow Up\" (The Pussycat Dolls)"
    }
  },
  {
    "id": "as09-e10-r1-2",
    "seasonId": "as09",
    "episode": 10,
    "round": "R1",
    "sequence": 2,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "You Spin Me Round (Like a Record)",
      "artist": "Dead or Alive",
      "raw": "\"You Spin Me Round (Like a Record)\" — Dead or Alive"
    },
    "sides": [
      {
        "queens": [
          "nina11"
        ]
      },
      {
        "queens": [
          "shannel"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shannel"
        ]
      }
    ],
    "eliminated": [],
    "notes": "R1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 10: Nina West vs. Shannel — \"You Spin Me Round (Like a Record)\" (Dead or Alive)"
    }
  },
  {
    "id": "as09-e10-r1-3",
    "seasonId": "as09",
    "episode": 10,
    "round": "R1",
    "sequence": 3,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Holding Out for a Hero",
      "artist": "Bonnie Tyler",
      "raw": "\"Holding Out for a Hero\" — Bonnie Tyler"
    },
    "sides": [
      {
        "queens": [
          "jorgeous"
        ]
      },
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "eliminated": [],
    "notes": "R1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 10: Jorgeous vs. Roxxxy Andrews — \"Holding Out for a Hero\" (Bonnie Tyler)"
    }
  },
  {
    "id": "as09-e10-r2-1",
    "seasonId": "as09",
    "episode": 10,
    "round": "R2",
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "I'm Every Woman",
      "artist": "Chaka Khan",
      "raw": "\"I'm Every Woman\" — Chaka Khan"
    },
    "sides": [
      {
        "queens": [
          "shannel"
        ]
      },
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "shannel"
        ]
      }
    ],
    "eliminated": [],
    "notes": "R2",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 10: Shannel vs. Vanessa Vanjie — \"I'm Every Woman\" (Chaka Khan)"
    }
  },
  {
    "id": "as09-e10-r2-2",
    "seasonId": "as09",
    "episode": 10,
    "round": "R2",
    "sequence": 2,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Groove Is in the Heart",
      "artist": "Deee-Lite",
      "raw": "\"Groove Is in the Heart\" — Deee-Lite"
    },
    "sides": [
      {
        "queens": [
          "angeria"
        ]
      },
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "roxxxy"
        ]
      }
    ],
    "eliminated": [],
    "notes": "R2",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 10: Angeria Paris VanMicheals vs. Roxxxy Andrews — \"Groove Is in the Heart\" (Deee-Lite)"
    }
  },
  {
    "id": "as09-e12-1",
    "seasonId": "as09",
    "episode": 12,
    "episodeLabel": "Finale",
    "sequence": 1,
    "type": "for_the_crown",
    "outcome": "multi_advance",
    "song": {
      "title": "Rhythm Nation",
      "artist": "Janet Jackson",
      "raw": "\"Rhythm Nation\" — Janet Jackson"
    },
    "sides": [
      {
        "queens": [
          "angeria"
        ]
      },
      {
        "queens": [
          "roxxxy"
        ]
      },
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "angeria"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "roxxxy"
        ]
      },
      {
        "queens": [
          "vanjie"
        ]
      }
    ],
    "notes": "Three-way; Angeria crowned AS9 winner",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_9",
      "revision": 1342152888,
      "sha256": "3b5f6c8271c44bf4289461dca6a0877472c90a994750eabdbed6e017b54b8773",
      "fetchedAt": "2026-04-21T22:37:41.603Z",
      "quote": "Ep 12: Angeria Paris VanMicheals vs. Roxxxy Andrews vs. Vanessa Vanjie — \"Rhythm Nation\" (Janet Jackson)"
    }
  },
  {
    "id": "as10-e01-b1-1",
    "seasonId": "as10",
    "episode": 1,
    "bracket": "Bracket 1",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Think U the Shit (Fart)",
      "artist": "Ice Spice",
      "raw": "\"Think U the Shit (Fart)\" — Ice Spice"
    },
    "sides": [
      {
        "queens": [
          "aja"
        ]
      },
      {
        "queens": [
          "irene"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "aja"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Bracket-1 opener",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 1: Aja vs. Irene the Alien — \"Think U the Shit (Fart)\" (Ice Spice)"
    }
  },
  {
    "id": "as10-e02-b1-1",
    "seasonId": "as10",
    "episode": 2,
    "bracket": "Bracket 1",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Murder on the Dancefloor",
      "artist": "Sophie Ellis-Bextor",
      "raw": "\"Murder on the Dancefloor\" — Sophie Ellis-Bextor"
    },
    "sides": [
      {
        "queens": [
          "bosco"
        ]
      },
      {
        "queens": [
          "irene"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "bosco"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Improv mystery week",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 2: Bosco vs. Irene the Alien — \"Murder on the Dancefloor\" (Sophie Ellis-Bextor)"
    }
  },
  {
    "id": "as10-e03-b1-final-1",
    "seasonId": "as10",
    "episode": 3,
    "bracket": "Bracket 1",
    "round": "Final",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Pocketbook",
      "artist": "Jennifer Hudson ft. Ludacris",
      "raw": "\"Pocketbook\" — Jennifer Hudson ft. Ludacris"
    },
    "sides": [
      {
        "queens": [
          "bosco"
        ]
      },
      {
        "queens": [
          "irene"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "irene"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "deja"
        ]
      },
      {
        "queens": [
          "olivia"
        ]
      },
      {
        "queens": [
          "phoenix"
        ]
      }
    ],
    "notes": "Aja/Bosco/Irene advance",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 3: Bosco vs. Irene the Alien — \"Pocketbook\" (Jennifer Hudson ft. Ludacris)"
    }
  },
  {
    "id": "as10-e04-b2-1",
    "seasonId": "as10",
    "episode": 4,
    "bracket": "Bracket 2",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Love Sensation",
      "artist": "Loleatta Holloway",
      "raw": "\"Love Sensation\" — Loleatta Holloway"
    },
    "sides": [
      {
        "queens": [
          "lydia"
        ]
      },
      {
        "queens": [
          "tina"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "eliminated": [],
    "notes": "8-ball design challenge",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 4: Lydia B Kollins vs. Tina Burner — \"Love Sensation\" (Loleatta Holloway)"
    }
  },
  {
    "id": "as10-e05-b2-1",
    "seasonId": "as10",
    "episode": 5,
    "bracket": "Bracket 2",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "double_shantay",
    "song": {
      "title": "Hot to Go!",
      "artist": "Chappell Roan",
      "raw": "\"Hot to Go!\" — Chappell Roan"
    },
    "sides": [
      {
        "queens": [
          "jorgeous"
        ]
      },
      {
        "queens": [
          "mistress"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jorgeous"
        ]
      },
      {
        "queens": [
          "mistress"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Tie; $5K + half point each",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 5: Jorgeous vs. Mistress Isabelle Brooks — \"Hot to Go!\" (Chappell Roan)"
    }
  },
  {
    "id": "as10-e06-b2-final-1",
    "seasonId": "as10",
    "episode": 6,
    "bracket": "Bracket 2",
    "round": "Final",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Texas Hold 'Em",
      "artist": "Beyoncé",
      "raw": "\"Texas Hold 'Em\" — Beyoncé"
    },
    "sides": [
      {
        "queens": [
          "jorgeous"
        ]
      },
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kerri"
        ]
      },
      {
        "queens": [
          "nicole"
        ]
      },
      {
        "queens": [
          "tina"
        ]
      }
    ],
    "notes": "Jorgeous/Lydia/Mistress advance",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 6: Jorgeous vs. Lydia B Kollins — \"Texas Hold 'Em\" (Beyoncé)"
    }
  },
  {
    "id": "as10-e07-b3-1",
    "seasonId": "as10",
    "episode": 7,
    "bracket": "Bracket 3",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Defying Gravity",
      "artist": "Idina Menzel, Kristin Chenoweth",
      "raw": "\"Defying Gravity\" — Original Broadway cast of Wicked"
    },
    "sides": [
      {
        "queens": [
          "daya"
        ]
      },
      {
        "queens": [
          "ginger"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ginger"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Erivo & Grande guest judges",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 7: Daya Betty vs. Ginger Minj — \"Defying Gravity\" (Idina Menzel, Kristin Chenoweth)"
    }
  },
  {
    "id": "as10-e08-b3-1",
    "seasonId": "as10",
    "episode": 8,
    "bracket": "Bracket 3",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "See You Again",
      "artist": "Miley Cyrus",
      "raw": "\"See You Again\" — Miley Cyrus"
    },
    "sides": [
      {
        "queens": [
          "denali"
        ]
      },
      {
        "queens": [
          "ginger"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ginger"
        ]
      }
    ],
    "eliminated": [],
    "notes": "Ginger back-to-back",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 8: Denali vs. Ginger Minj — \"See You Again\" (Miley Cyrus)"
    }
  },
  {
    "id": "as10-e09-b3-final-1",
    "seasonId": "as10",
    "episode": 9,
    "bracket": "Bracket 3",
    "round": "Final",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Mama Used to Say",
      "artist": "Junior",
      "raw": "\"Mama Used to Say\" — Junior"
    },
    "sides": [
      {
        "queens": [
          "daya"
        ]
      },
      {
        "queens": [
          "ginger"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "daya"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "acidbetty"
        ]
      },
      {
        "queens": [
          "alyssa14"
        ]
      },
      {
        "queens": [
          "denali"
        ]
      }
    ],
    "notes": "Cynthia/Daya/Ginger advance",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 9: Daya Betty vs. Ginger Minj — \"Mama Used to Say\" (Junior)"
    }
  },
  {
    "id": "as10-e10-1",
    "seasonId": "as10",
    "episode": 10,
    "episodeLabel": "Semifinals",
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Who's Zoomin' Who",
      "artist": "Aretha Franklin",
      "raw": "\"Who's Zoomin' Who\" (Acappella Mix) — Aretha Franklin"
    },
    "sides": [
      {
        "queens": [
          "cynthia"
        ]
      },
      {
        "queens": [
          "mistress"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "mistress"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "cynthia"
        ]
      }
    ],
    "notes": "First elimination-format lip sync",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 10: Cynthia Lee Fontaine vs. Mistress Isabelle Brooks — \"Who's Zoomin' Who\" (Aretha Franklin)"
    }
  },
  {
    "id": "as10-e11-1",
    "seasonId": "as10",
    "episode": 11,
    "episodeLabel": "Semifinals",
    "sequence": 1,
    "type": "for_the_win",
    "outcome": "single_winner",
    "song": {
      "title": "Guess",
      "artist": "Charli XCX, Billie Eilish",
      "raw": "\"Guess\" — Charli XCX & Billie Eilish"
    },
    "sides": [
      {
        "queens": [
          "lydia"
        ]
      },
      {
        "queens": [
          "mistress"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "mistress"
        ]
      }
    ],
    "notes": "Trims field to 7",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 11: Lydia B Kollins vs. Mistress Isabelle Brooks — \"Guess\" (Charli XCX, Billie Eilish)"
    }
  },
  {
    "id": "as10-e12-smackdown-r1-1",
    "seasonId": "as10",
    "episode": 12,
    "episodeLabel": "Finale",
    "bracket": "Smackdown",
    "round": "R1",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Disease",
      "artist": "Lady Gaga",
      "raw": "\"Disease\" — Lady Gaga"
    },
    "sides": [
      {
        "queens": [
          "ginger"
        ]
      },
      {
        "queens": [
          "kerri"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ginger"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "kerri"
        ]
      }
    ],
    "notes": "Kerri returned via lottery",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 12: Ginger Minj vs. Kerri Colby — \"Disease\" (Lady Gaga)"
    }
  },
  {
    "id": "as10-e12-smackdown-r1-2",
    "seasonId": "as10",
    "episode": 12,
    "episodeLabel": "Finale",
    "bracket": "Smackdown",
    "round": "R1",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Joyride",
      "artist": "Kesha",
      "raw": "\"Joyride\" — Kesha"
    },
    "sides": [
      {
        "queens": [
          "irene"
        ]
      },
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "irene"
        ]
      }
    ],
    "notes": "R1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 12: Irene the Alien vs. Lydia B Kollins — \"Joyride\" (Kesha)"
    }
  },
  {
    "id": "as10-e12-smackdown-r1-3",
    "seasonId": "as10",
    "episode": 12,
    "episodeLabel": "Finale",
    "bracket": "Smackdown",
    "round": "R1",
    "sequence": 3,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Party Lights",
      "artist": "Natalie Cole",
      "raw": "\"Party Lights\" — Natalie Cole"
    },
    "sides": [
      {
        "queens": [
          "aja"
        ]
      },
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "aja"
        ]
      }
    ],
    "notes": "R1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 12: Aja vs. Jorgeous — \"Party Lights\" (Natalie Cole)"
    }
  },
  {
    "id": "as10-e12-smackdown-r1-4",
    "seasonId": "as10",
    "episode": 12,
    "episodeLabel": "Finale",
    "bracket": "Smackdown",
    "round": "R1",
    "sequence": 4,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Show Me How You Burlesque",
      "artist": "Christina Aguilera",
      "raw": "\"Show Me How You Burlesque\" — Christina Aguilera"
    },
    "sides": [
      {
        "queens": [
          "bosco"
        ]
      },
      {
        "queens": [
          "daya"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "bosco"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "daya"
        ]
      }
    ],
    "notes": "R1",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 12: Bosco vs. Daya Betty — \"Show Me How You Burlesque\" (Christina Aguilera)"
    }
  },
  {
    "id": "as10-e12-smackdown-r2-1",
    "seasonId": "as10",
    "episode": 12,
    "episodeLabel": "Finale",
    "bracket": "Smackdown",
    "round": "R2",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Raise Your Glass",
      "artist": "Pink",
      "raw": "\"Raise Your Glass\" — Pink"
    },
    "sides": [
      {
        "queens": [
          "bosco"
        ]
      },
      {
        "queens": [
          "ginger"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ginger"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "bosco"
        ]
      }
    ],
    "notes": "R2",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 12: Bosco vs. Ginger Minj — \"Raise Your Glass\" (Pink)"
    }
  },
  {
    "id": "as10-e12-smackdown-r2-2",
    "seasonId": "as10",
    "episode": 12,
    "episodeLabel": "Finale",
    "bracket": "Smackdown",
    "round": "R2",
    "sequence": 2,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "Whenever, Wherever",
      "artist": "Shakira",
      "raw": "\"Whenever, Wherever\" — Shakira"
    },
    "sides": [
      {
        "queens": [
          "jorgeous"
        ]
      },
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "lydia"
        ]
      }
    ],
    "notes": "R2",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 12: Jorgeous vs. Lydia B Kollins — \"Whenever, Wherever\" (Shakira)"
    }
  },
  {
    "id": "as10-e12-smackdown-final-1",
    "seasonId": "as10",
    "episode": 12,
    "episodeLabel": "Finale",
    "bracket": "Smackdown",
    "round": "Final",
    "sequence": 1,
    "type": "lalaparuza",
    "outcome": "single_winner",
    "song": {
      "title": "It's Raining Men",
      "artist": "The Weather Girls",
      "raw": "\"It's Raining Men\" — The Weather Girls"
    },
    "sides": [
      {
        "queens": [
          "ginger"
        ]
      },
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "winners": [
      {
        "queens": [
          "ginger"
        ]
      }
    ],
    "eliminated": [
      {
        "queens": [
          "jorgeous"
        ]
      }
    ],
    "notes": "Ginger Minj crowned AS10 winner",
    "verified": true,
    "flags": [],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_10",
      "revision": 1350248394,
      "sha256": "067e1f4ff7f6d97e0d18e110c122d2f30b33e8157335a69a0598029d957ef1e0",
      "fetchedAt": "2026-04-21T22:37:42.105Z",
      "quote": "Ep 12: Ginger Minj vs. Jorgeous — \"It's Raining Men\" (The Weather Girls)"
    }
  }
];
