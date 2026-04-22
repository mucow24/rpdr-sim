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
      "sha256": "2e0a6e55546ca49b13d7c7a02a45bc4f2434ca27d1a52666e487f50679e5dccb",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Akashia and Victoria \"Porkchop\" Parker lip-sync to \"<a href=\"/wiki/Supermodel_(You_Better_Work)\" title=\"Supermodel (You Better Work)\">Supermodel (You Better Work)</a>\" by <a href=\"/wiki/RuPaul\" title=\"RuPaul\">RuPaul</a>. Akashia wins the lip-sync and Victoria \"Porkchop\" Parker is the first queen to sashay away."
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
      "sha256": "2e0a6e55546ca49b13d7c7a02a45bc4f2434ca27d1a52666e487f50679e5dccb",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "They lip-sync to \"<a href=\"/wiki/We_Break_the_Dawn\" title=\"We Break the Dawn\">We Break the Dawn</a>\" by <a href=\"/wiki/Michelle_Williams_(singer)\" title=\"Michelle Williams (singer)\">Michelle Williams</a>. Akashia wins the lip-sync and Tammie Brown sashays away."
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
      "sha256": "2e0a6e55546ca49b13d7c7a02a45bc4f2434ca27d1a52666e487f50679e5dccb",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Akashia and Shannel lip-sync to \"<a href=\"/wiki/Greatest_Love_of_All\" class=\"mw-redirect\" title=\"Greatest Love of All\">The Greatest Love of All</a>\" by <a href=\"/wiki/Whitney_Houston\" title=\"Whitney Houston\">Whitney Houston</a>. Shannel wins the lip-sync and Akashia sashays away."
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
      "sha256": "2e0a6e55546ca49b13d7c7a02a45bc4f2434ca27d1a52666e487f50679e5dccb",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Jade and Rebecca Glasscock lip-sync to \"<a href=\"/wiki/Would_I_Lie_to_You%3F_(Eurythmics_song)\" title=\"Would I Lie to You? (Eurythmics song)\">Would I Lie To You?</a>\" by <a href=\"/wiki/The_Eurythmics\" class=\"mw-redirect\" title=\"The Eurythmics\">The Eurythmics</a>. Rebecca Glasscock wins the lip-sync and Jade sashays away."
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
      "sha256": "2e0a6e55546ca49b13d7c7a02a45bc4f2434ca27d1a52666e487f50679e5dccb",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "BeBe Zahara Benet and Ongina lip-sync to \"<a href=\"/wiki/Stronger_(Britney_Spears_song)\" title=\"Stronger (Britney Spears song)\">Stronger</a>\" by <a href=\"/wiki/Britney_Spears\" title=\"Britney Spears\">Britney Spears</a>. BeBe Zahara Benet wins the lip-sync and Ongina sashays away."
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
      "sha256": "2e0a6e55546ca49b13d7c7a02a45bc4f2434ca27d1a52666e487f50679e5dccb",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "They lip-sync to \"<a href=\"/wiki/Shackles_(Praise_You)\" title=\"Shackles (Praise You)\">Shackles (Praise You)</a>\" by <a href=\"/wiki/Mary_Mary\" title=\"Mary Mary\">Mary Mary</a>. Rebecca Glasscock wins the lip-sync and Shannel sashays away."
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
      "sha256": "2e0a6e55546ca49b13d7c7a02a45bc4f2434ca27d1a52666e487f50679e5dccb",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "After they lip-sync to \"<a href=\"/wiki/Cover_Girl_(RuPaul_song)\" class=\"mw-redirect\" title=\"Cover Girl (RuPaul song)\">Cover Girl (Put the Bass in Your Walk)</a>\" by <a href=\"/wiki/RuPaul\" title=\"RuPaul\">RuPaul</a>, BeBe Zahara Benet is announced as the winner, leaving Nina Flowers as the runner-up."
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
      "sha256": "8cc36821be0bcc937cb61f3be7fb40fcb459e5687e1db7d102c0f723e19143e9",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Sahara Davenport and Shangela Laquifa Wadley lip-sync to \"<a href=\"/wiki/Cover_Girl_(RuPaul_song)\" class=\"mw-redirect\" title=\"Cover Girl (RuPaul song)\">Cover Girl (Put the Bass in Your Walk)</a>\" by <a href=\"/wiki/RuPaul\" title=\"RuPaul\">RuPaul</a>. Sahara Davenport wins the lip-sync and Shangela Laquifa Wadley sashays away."
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
      "sha256": "8cc36821be0bcc937cb61f3be7fb40fcb459e5687e1db7d102c0f723e19143e9",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Nicole Paige Brooks and Raven lip-sync to \"<a href=\"/wiki/My_Lovin%27_(You%27re_Never_Gonna_Get_It)\" title=\"My Lovin&#39; (You&#39;re Never Gonna Get It)\">My Lovin' (You're Never Gonna Get It)</a>\" by <a href=\"/wiki/En_Vogue\" title=\"En Vogue\">En Vogue</a>. Raven wins the lip-sync and Nicole Paige Brooks sashays away."
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
      "sha256": "8cc36821be0bcc937cb61f3be7fb40fcb459e5687e1db7d102c0f723e19143e9",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Mystique Summers Madison and Raven receive negative critiques, and are announced as the bottom two. They lip-sync to \"<a href=\"/wiki/I_Hear_You_Knockin%27\" class=\"mw-redirect\" title=\"I Hear You Knockin&#39;\">I Hear You Knockin'</a>\" by <a href=\"/wiki/Wynonna_Judd\" title=\"Wynonna Judd\">Wynonna Judd</a>. Raven wins the lip-sync and Mystique Summers Madison sashays away."
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
      "sha256": "8cc36821be0bcc937cb61f3be7fb40fcb459e5687e1db7d102c0f723e19143e9",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Morgan McMichaels and Sonique lip-sync to \"<a href=\"/wiki/Two_of_Hearts_(song)\" title=\"Two of Hearts (song)\">Two of Hearts (song)</a>\" by <a href=\"/wiki/Stacey_Q\" title=\"Stacey Q\">Stacey Q</a>. Morgan McMichaels wins the lip-sync and Sonique sashays away."
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
      "sha256": "8cc36821be0bcc937cb61f3be7fb40fcb459e5687e1db7d102c0f723e19143e9",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "<li><b>Bottom Two:</b> Morgan McMichaels and Sahara Davenport</li>\n<li><b>Lip-Sync Song:</b> \"<a href=\"/wiki/Carry_On_(Martha_Wash_song)\" title=\"Carry On (Martha Wash song)\">Carry On</a>\" by <a href=\"/wiki/Martha_Wash\" title=\"Martha Wash\">Martha Wash</a></li>\n<li><span style=\"color:crimson\"><b>Eliminated:</b> Morgan McMichaels</span></li>"
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
      "sha256": "8cc36821be0bcc937cb61f3be7fb40fcb459e5687e1db7d102c0f723e19143e9",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Jujubee and Sahara Davenport lip-sync to \"<a href=\"/wiki/Black_Velvet_(song)\" title=\"Black Velvet (song)\">Black Velvet</a>\" by <a href=\"/wiki/Alannah_Myles\" title=\"Alannah Myles\">Alannah Myles</a>. Jujubee wins the lip-sync and Sahara Davenport sashays away."
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
      "sha256": "8cc36821be0bcc937cb61f3be7fb40fcb459e5687e1db7d102c0f723e19143e9",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Jessica Wild and Tatianna lip-sync to \"<a href=\"/wiki/He%27s_the_Greatest_Dancer\" title=\"He&#39;s the Greatest Dancer\">He's the Greatest Dancer</a>\" by <a href=\"/wiki/Sister_Sledge\" title=\"Sister Sledge\">Sister Sledge</a>. Tatianna wins the lip-sync and Jessica Wild sashays away."
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
      "sha256": "8cc36821be0bcc937cb61f3be7fb40fcb459e5687e1db7d102c0f723e19143e9",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Jujubee and Pandora Boxx receive negative critiques, and are announced as the bottom two. They lip-sync to \"<a href=\"/wiki/Shake_Your_Love\" title=\"Shake Your Love\">Shake Your Love</a>\" by <a href=\"/wiki/Debbie_Gibson\" title=\"Debbie Gibson\">Debbie Gibson</a>. Jujubee wins the lip-sync and Pandora Boxx sashays away."
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
      "sha256": "8cc36821be0bcc937cb61f3be7fb40fcb459e5687e1db7d102c0f723e19143e9",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Jujubee and Tatianna receive negative critiques, and are announced as the bottom two. They lip-sync to \"<a href=\"/wiki/Something_He_Can_Feel\" title=\"Something He Can Feel\">Something He Can Feel</a>\" by <a href=\"/wiki/Aretha_Franklin\" title=\"Aretha Franklin\">Aretha Franklin</a>. Jujubee wins the lip-sync and Tatianna sashays away."
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
      "sha256": "8cc36821be0bcc937cb61f3be7fb40fcb459e5687e1db7d102c0f723e19143e9",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "On the runway, Jujubee is eliminated from the competition, leaving Raven and Tyra Sanchez as the top two queens of the season. They lip-sync to \"Jealous Of My Boogie (Gomi and RasJek Edit)\" by <a href=\"/wiki/RuPaul\" title=\"RuPaul\">RuPaul</a>. It is revealed that Tyra Sanchez is the winner, leaving Raven as the runner-up."
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
      "sha256": "26651e3c0d0aac6b5d42229aae98547504bdaaf98aaa293f36297653b1987f22",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Shangela and Venus D-Lite lip-sync to \"<a href=\"/wiki/The_Right_Stuff_(Vanessa_Williams_song)\" title=\"The Right Stuff (Vanessa Williams song)\">The Right Stuff</a>\" by <a href=\"/wiki/Vanessa_Williams\" title=\"Vanessa Williams\">Vanessa Williams</a>. Shangela wins the lip-sync and Venus D-Lite is the first queen to sashay away."
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
      "sha256": "26651e3c0d0aac6b5d42229aae98547504bdaaf98aaa293f36297653b1987f22",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Delta Work and Phoenix lip-sync to \"<a href=\"/wiki/Bad_Romance_(song)\" class=\"mw-redirect\" title=\"Bad Romance (song)\">Bad Romance</a>\" by <a href=\"/wiki/Lady_Gaga\" title=\"Lady Gaga\">Lady Gaga</a>. Delta Work wins the lip-sync and Phoenix sashays away."
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
      "sha256": "26651e3c0d0aac6b5d42229aae98547504bdaaf98aaa293f36297653b1987f22",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "India Ferrah and Mimi Imfurst lip-sync to \"<a href=\"/wiki/Don%27t_Leave_Me_This_Way\" title=\"Don&#39;t Leave Me This Way\">Don't Leave Me This Way</a>\" by <a href=\"/wiki/Thelma_Houston\" title=\"Thelma Houston\">Thelma Houston</a>. India Ferrah wins the lip-sync and Mimi Imfurst sashays away."
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
      "sha256": "26651e3c0d0aac6b5d42229aae98547504bdaaf98aaa293f36297653b1987f22",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "India Ferrah and Stacy Layne Matthews lip-sync to \"<a href=\"/wiki/Meeting_in_the_Ladies_Room_(song)\" title=\"Meeting in the Ladies Room (song)\">Meeting in the Ladies Room</a>\" by <a href=\"/wiki/Klymaxx\" title=\"Klymaxx\">Klymaxx</a>. Stacy Layne Matthews wins the lip-sync and India Ferrah sashays away."
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
      "sha256": "26651e3c0d0aac6b5d42229aae98547504bdaaf98aaa293f36297653b1987f22",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Delta Work and Mariah lip-sync to \"<a href=\"/wiki/Looking_for_a_New_Love\" title=\"Looking for a New Love\">Looking for a New Love</a>\" by <a href=\"/wiki/Jody_Watley\" title=\"Jody Watley\">Jody Watley</a>. Delta Work wins the lip-sync and Mariah sashays away."
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
      "sha256": "26651e3c0d0aac6b5d42229aae98547504bdaaf98aaa293f36297653b1987f22",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Alexis Mateo and Stacy Layne Matthews lip-sync to \"<a href=\"/wiki/Knock_on_Wood_(Eddie_Floyd_song)\" title=\"Knock on Wood (Eddie Floyd song)\">Knock on Wood</a>\" by <a href=\"/wiki/Amii_Stewart\" title=\"Amii Stewart\">Amii Stewart</a>. Alexis Mateo wins the lip-sync and Stacy Layne Matthews sashays away."
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
      "sha256": "26651e3c0d0aac6b5d42229aae98547504bdaaf98aaa293f36297653b1987f22",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "They lip-sync to \"<a href=\"/wiki/MacArthur_Park_(song)\" title=\"MacArthur Park (song)\">MacArthur Park</a>\" by <a href=\"/wiki/Donna_Summer\" title=\"Donna Summer\">Donna Summer</a>. Manila Luzon wins the lip-sync and Delta Work sashays away."
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
      "title": "Mickey (Spanish Version)",
      "artist": "Toni Basil",
      "raw": "\"Mickey (Spanish Version)\" — Toni Basil"
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
      "sha256": "26651e3c0d0aac6b5d42229aae98547504bdaaf98aaa293f36297653b1987f22",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Carmen Carrera and Yara Sofia lip-sync to \"<a href=\"/wiki/Mickey_(Toni_Basil_song)\" title=\"Mickey (Toni Basil song)\">Mickey</a> (Spanish Version)\" by <a href=\"/wiki/Toni_Basil\" title=\"Toni Basil\">Toni Basil</a>. Both queens win the lip-sync and no one goes home."
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
      "sha256": "26651e3c0d0aac6b5d42229aae98547504bdaaf98aaa293f36297653b1987f22",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "Carmen Carrera and Shangela lip-sync to \"<a href=\"/wiki/Believe_(Cher_song)\" title=\"Believe (Cher song)\">Believe</a>\" by <a href=\"/wiki/Cher\" title=\"Cher\">Cher</a>. Shangela wins the lip-sync and Carmen Carrera sashays away."
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
      "sha256": "26651e3c0d0aac6b5d42229aae98547504bdaaf98aaa293f36297653b1987f22",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "They lip-sync to \"<a href=\"/wiki/Even_Angels\" class=\"mw-redirect\" title=\"Even Angels\">Even Angels</a>\" by <a href=\"/wiki/Fantasia_Barrino\" class=\"mw-redirect\" title=\"Fantasia Barrino\">Fantasia</a>. Alexis Mateo wins the lip-sync and Shangela sashays away."
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
      "sha256": "26651e3c0d0aac6b5d42229aae98547504bdaaf98aaa293f36297653b1987f22",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "They lip-sync to \"<a href=\"/wiki/Straight_Up_(Paula_Abdul_song)\" title=\"Straight Up (Paula Abdul song)\">Straight Up</a>\" by <a href=\"/wiki/Paula_Abdul\" title=\"Paula Abdul\">Paula Abdul</a>. Raja wins the lip-sync and Carmen Carrera sashays away."
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
      "sha256": "26651e3c0d0aac6b5d42229aae98547504bdaaf98aaa293f36297653b1987f22",
      "fetchedAt": "2026-04-22T20:23:55.149Z",
      "quote": "They lip-sync to \"I Think About You\" by <a href=\"/wiki/Patti_LaBelle\" title=\"Patti LaBelle\">Patti LaBelle</a>. Alexis Mateo wins the lip-sync and Yara Sofia sashays away."
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
      "sha256": "26651e3c0d0aac6b5d42229aae98547504bdaaf98aaa293f36297653b1987f22",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "They lip-sync to \"Champion (DJ BunJoe's Olympic Mix)\" by <a href=\"/wiki/RuPaul\" title=\"RuPaul\">RuPaul</a>. It is then announced that Raja is the winner, leaving Manila Luzon as the runner-up."
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
      "sha256": "174ed7196160c640fbd4ccb904ff3e8b8ac4fbcc6d6d9668fa70c313e57c51b9",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Alisa Summers and Jiggly Caliente lip-sync to \"<a href=\"/wiki/Toxic_(song)\" title=\"Toxic (song)\">Toxic</a>\" by <a href=\"/wiki/Britney_Spears\" title=\"Britney Spears\">Britney Spears</a>. Jiggly Caliente wins the lip-sync and Alisa Summers is the first queen to sashay away."
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
      "sha256": "174ed7196160c640fbd4ccb904ff3e8b8ac4fbcc6d6d9668fa70c313e57c51b9",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Lashauwn Beyond and The Princess lip-sync to \"<a href=\"/wiki/Bad_Girls_(Donna_Summer_song)\" title=\"Bad Girls (Donna Summer song)\">Bad Girls</a>\" by <a href=\"/wiki/Donna_Summer\" title=\"Donna Summer\">Donna Summer</a>. The Princess wins the lip-sync and Lashauwn Beyond sashays away."
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
      "sha256": "174ed7196160c640fbd4ccb904ff3e8b8ac4fbcc6d6d9668fa70c313e57c51b9",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "DiDa Ritz and The Princess lip-sync to \"<a href=\"/wiki/This_Will_Be_(An_Everlasting_Love)\" class=\"mw-redirect\" title=\"This Will Be (An Everlasting Love)\">This Will Be (An Everlasting Love)</a>\" by <a href=\"/wiki/Natalie_Cole\" title=\"Natalie Cole\">Natalie Cole</a>. DiDa Ritz wins the lip-sync and The Princess sashays away."
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
      "sha256": "174ed7196160c640fbd4ccb904ff3e8b8ac4fbcc6d6d9668fa70c313e57c51b9",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Madame LaQueer and Milan lip-sync to \"<a href=\"/wiki/Trouble_(Pink_song)\" title=\"Trouble (Pink song)\">Trouble</a>\" by <a href=\"/wiki/Pink_(singer)\" title=\"Pink (singer)\">Pink</a>. Milan wins the lip-sync and Madame LaQueer sashays away."
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
      "sha256": "174ed7196160c640fbd4ccb904ff3e8b8ac4fbcc6d6d9668fa70c313e57c51b9",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Kenya Michaels and Milan lip-sync to \"<a href=\"/wiki/Vogue_(Madonna_song)\" class=\"mw-redirect\" title=\"Vogue (Madonna song)\">Vogue</a>\" by <a href=\"/wiki/Madonna_(entertainer)\" class=\"mw-redirect\" title=\"Madonna (entertainer)\">Madonna</a>. Milan wins the lip-sync and Kenya Michaels sashays away."
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
      "sha256": "174ed7196160c640fbd4ccb904ff3e8b8ac4fbcc6d6d9668fa70c313e57c51b9",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Jiggly Caliente and Milan lip-sync to \"<a href=\"/wiki/Born_This_Way_(song)\" title=\"Born This Way (song)\">Born This Way</a>\" by <a href=\"/wiki/Lady_Gaga\" title=\"Lady Gaga\">Lady Gaga</a>\". Jiggly Caliente wins the lip-sync and Milan sashays away."
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
      "sha256": "174ed7196160c640fbd4ccb904ff3e8b8ac4fbcc6d6d9668fa70c313e57c51b9",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Jiggly Caliente and Willam lip-sync to \"<a href=\"/wiki/Mi_Vida_Loca_(My_Crazy_Life)\" title=\"Mi Vida Loca (My Crazy Life)\">Mi Vida Loca</a>\" by <a href=\"/wiki/Pam_Tillis\" title=\"Pam Tillis\">Pam Tillis</a>. Willam wins the lip-sync and Jiggly Caliente sashays away."
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
      "sha256": "174ed7196160c640fbd4ccb904ff3e8b8ac4fbcc6d6d9668fa70c313e57c51b9",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Phi Phi O'Hara and Sharon Needles are announced as the bottom two and lip-sync to \"<a href=\"/wiki/It%27s_Raining_Men\" title=\"It&#39;s Raining Men\">It's Raining Men (The Sequel)</a>\" by <a href=\"/wiki/Martha_Wash\" title=\"Martha Wash\">Martha Wash</a> and <a href=\"/wiki/RuPaul\" title=\"RuPaul\">RuPaul</a>. After the lip-sync, RuPaul announces that Willam has broken the rules, and will be disqualified from the competition immediately. Because of this disqualification, Phi Phi O'Hara and Sharon Needles both win the lip-sync."
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
      "sha256": "174ed7196160c640fbd4ccb904ff3e8b8ac4fbcc6d6d9668fa70c313e57c51b9",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "DiDa Ritz and Latrice Royale lip-sync to \"<a href=\"/wiki/I%27ve_Got_to_Use_My_Imagination\" title=\"I&#39;ve Got to Use My Imagination\">I've Got to Use My Imagination</a>\" by <a href=\"/wiki/Gladys_Knight_%26_the_Pips\" title=\"Gladys Knight &amp; the Pips\">Gladys Knight &amp; the Pips</a>. Latrice Royale wins the lip-sync and DiDa Ritz sashays away."
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
      "sha256": "174ed7196160c640fbd4ccb904ff3e8b8ac4fbcc6d6d9668fa70c313e57c51b9",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Kenya Michaels and Latrice Royale lip-sync to \"<a href=\"/wiki/(You_Make_Me_Feel_Like)_A_Natural_Woman\" title=\"(You Make Me Feel Like) A Natural Woman\">(You Make Me Feel Like) A Natural Woman</a>\" by <a href=\"/wiki/Aretha_Franklin\" title=\"Aretha Franklin\">Aretha Franklin</a>. Latrice Royale wins the lip-sync and Kenya Michaels sashays away."
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
      "sha256": "174ed7196160c640fbd4ccb904ff3e8b8ac4fbcc6d6d9668fa70c313e57c51b9",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "They lip-sync to \"<a href=\"/wiki/No_One_Else_on_Earth\" title=\"No One Else on Earth\">No One Else on Earth</a>\" by <a href=\"/wiki/Wynonna_Judd\" title=\"Wynonna Judd\">Wynonna Judd</a>. Chad Michaels wins the lip-sync and Latrice Royale sashays away."
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
      "sha256": "38b44d524c97580a1374bd2be51e8e99084ed1a98ece912f0f8d043849ca2f6b",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Penny Tration and Serena ChaCha lip-sync to \"<a href=\"/wiki/Party_in_the_U.S.A.\" title=\"Party in the U.S.A.\">Party in the U.S.A.</a>\" by <a href=\"/wiki/Miley_Cyrus\" title=\"Miley Cyrus\">Miley Cyrus</a>. Serena ChaCha wins the lip-sync and Penny Tration is the first queen to sashay away."
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
      "sha256": "38b44d524c97580a1374bd2be51e8e99084ed1a98ece912f0f8d043849ca2f6b",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Monica Beverly Hillz and Serena ChaCha receive negative critiques, and are announced as the bottom two. They lip-sync to \"<a href=\"/wiki/Only_Girl_(In_the_World)\" title=\"Only Girl (In the World)\">Only Girl (In the World)</a>\" by <a href=\"/wiki/Rihanna\" title=\"Rihanna\">Rihanna</a>. Monica Beverly Hillz wins the lip-sync and Serena ChaCha sashays away."
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
      "sha256": "38b44d524c97580a1374bd2be51e8e99084ed1a98ece912f0f8d043849ca2f6b",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Coco Montrese and Monica Beverly Hillz lip-sync to \"<a href=\"/wiki/When_I_Grow_Up_(The_Pussycat_Dolls_song)\" title=\"When I Grow Up (The Pussycat Dolls song)\">When I Grow Up</a>\" by <a href=\"/wiki/The_Pussycat_Dolls\" title=\"The Pussycat Dolls\">The Pussycat Dolls</a>. Coco Montrese wins the lip-sync and Monica Beverly Hillz sashays away."
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
      "sha256": "38b44d524c97580a1374bd2be51e8e99084ed1a98ece912f0f8d043849ca2f6b",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "After an underwhelming lip-sync to \"<a href=\"/wiki/Oops!..._I_Did_It_Again_(song)\" title=\"Oops!... I Did It Again (song)\">Oops!... I Did It Again</a>\" by <a href=\"/wiki/Britney_Spears\" title=\"Britney Spears\">Britney Spears</a>, RuPaul eliminates both Honey Mahogany and Vivienne Pinay from the competition."
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
      "sha256": "38b44d524c97580a1374bd2be51e8e99084ed1a98ece912f0f8d043849ca2f6b",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Detox and Lineysha Sparx lip-sync to \"<a href=\"/wiki/Take_Me_Home_(Cher_song)\" title=\"Take Me Home (Cher song)\">Take Me Home</a>\" by <a href=\"/wiki/Cher\" title=\"Cher\">Cher</a>. Detox wins the lip-sync and Lineysha Sparx sashays away."
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
      "sha256": "38b44d524c97580a1374bd2be51e8e99084ed1a98ece912f0f8d043849ca2f6b",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Coco Montrese and Jade Jolie lip-sync to \"<a href=\"/wiki/I%27m_So_Excited\" title=\"I&#39;m So Excited\">I'm So Excited</a>\" by <a href=\"/wiki/The_Pointer_Sisters\" title=\"The Pointer Sisters\">The Pointer Sisters</a>. Coco Montrese wins the lip-sync and Jade Jolie sashays away."
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
      "sha256": "38b44d524c97580a1374bd2be51e8e99084ed1a98ece912f0f8d043849ca2f6b",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Alyssa Edwards and Roxxxy Andrews lip-sync to \"<a href=\"/wiki/Whip_My_Hair\" title=\"Whip My Hair\">Whip My Hair</a>\" by <a href=\"/wiki/Willow_Smith\" title=\"Willow Smith\">Willow Smith</a>. They are both declared the winners of the lip-sync and no one goes home."
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
      "sha256": "38b44d524c97580a1374bd2be51e8e99084ed1a98ece912f0f8d043849ca2f6b",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Alyssa Edwards and Ivy Winters lip-sync to \"<a href=\"/wiki/Ain%27t_Nothin%27_Goin%27_on_But_the_Rent\" class=\"mw-redirect\" title=\"Ain&#39;t Nothin&#39; Goin&#39; on But the Rent\">Ain't Nothin' Goin' on But the Rent</a>\" by <a href=\"/wiki/Gwen_Guthrie\" title=\"Gwen Guthrie\">Gwen Guthrie</a>. Alyssa Edwards wins the lip-sync and Ivy Winters sashays away."
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
      "sha256": "38b44d524c97580a1374bd2be51e8e99084ed1a98ece912f0f8d043849ca2f6b",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Alyssa Edwards and Coco Montrese lip-sync to \"<a href=\"/wiki/Cold_Hearted_(Paula_Abdul_song)\" class=\"mw-redirect\" title=\"Cold Hearted (Paula Abdul song)\">Cold Hearted</a>\" by <a href=\"/wiki/Paula_Abdul\" title=\"Paula Abdul\">Paula Abdul</a>. Coco Montrese wins the lip-sync and Alyssa Edwards sashays away."
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
      "sha256": "38b44d524c97580a1374bd2be51e8e99084ed1a98ece912f0f8d043849ca2f6b",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Coco Montrese and Detox lip-sync to \"<a href=\"/wiki/Two_to_Make_It_Right\" title=\"Two to Make It Right\">(It Takes) Two to Make It Right</a>\" by <a href=\"/wiki/Seduction_(band)\" class=\"mw-redirect\" title=\"Seduction (band)\">Seduction</a>. Detox wins the lip-sync and Coco Montrese sashays away."
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
      "sha256": "38b44d524c97580a1374bd2be51e8e99084ed1a98ece912f0f8d043849ca2f6b",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Detox and Jinkx Monsoon receive negative critiques are announced as the bottom two. They lip-sync to \"<a href=\"/wiki/Mambo!_(album)\" title=\"Mambo! (album)\">Malambo No. 1</a>\" by <a href=\"/wiki/Yma_Sumac\" title=\"Yma Sumac\">Yma Sumac</a>. Jinkx Monsoon wins the lip-sync and Detox sashays away."
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
      "sha256": "d0c2c8c81cf085c104443b430e50e5b9fcdb02c1a1e06cde46deb6c408298afd",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Kelly Mantle and Vivacious lip-sync to \"<a href=\"/wiki/Express_Yourself_(Madonna_song)\" title=\"Express Yourself (Madonna song)\">Express Yourself</a>\" by <a href=\"/wiki/Madonna\" title=\"Madonna\">Madonna</a>. Vivacious wins the lip-sync and Kelly Mantle is the first queen to sashay away."
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
      "sha256": "d0c2c8c81cf085c104443b430e50e5b9fcdb02c1a1e06cde46deb6c408298afd",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Darienne Lake and Magnolia Crawford lip-sync to \"<a href=\"/wiki/Turn_the_Beat_Around\" title=\"Turn the Beat Around\">Turn the Beat Around</a>\" by <a href=\"/wiki/Vicki_Sue_Robinson\" title=\"Vicki Sue Robinson\">Vicki Sue Robinson</a>. Darienne Lake wins the lip-sync and Magnolia Crawford sashays away."
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
      "sha256": "d0c2c8c81cf085c104443b430e50e5b9fcdb02c1a1e06cde46deb6c408298afd",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "April Carrión and Vivacious lip-sync to \"<a href=\"/wiki/Shake_It_Up_(Selena_Gomez_song)\" class=\"mw-redirect\" title=\"Shake It Up (Selena Gomez song)\">Shake It Up</a>\" by <a href=\"/wiki/Selena_Gomez\" title=\"Selena Gomez\">Selena Gomez</a>. April Carrión wins the lip-sync and Vivacious sashays away."
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
      "sha256": "d0c2c8c81cf085c104443b430e50e5b9fcdb02c1a1e06cde46deb6c408298afd",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "April Carrión and Trinity K. Bonet lip-sync to \"<a href=\"/wiki/I%27m_Every_Woman\" title=\"I&#39;m Every Woman\">I'm Every Woman</a>\" by <a href=\"/wiki/Chaka_Khan\" title=\"Chaka Khan\">Chaka Khan</a>. Trinity K. Bonet wins the lip-sync and April Carrión sashays away."
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
      "sha256": "d0c2c8c81cf085c104443b430e50e5b9fcdb02c1a1e06cde46deb6c408298afd",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Gia Gunn and Laganja Estranja lip-sync to \"<a href=\"/wiki/Head_to_Toe_(Lisa_Lisa_and_Cult_Jam_song)\" title=\"Head to Toe (Lisa Lisa and Cult Jam song)\">Head to Toe</a>\" by <a href=\"/wiki/Lisa_Lisa_%26_Cult_Jam\" class=\"mw-redirect\" title=\"Lisa Lisa &amp; Cult Jam\">Lisa Lisa &amp; Cult Jam</a>. Laganja Estranja wins the lip-sync and Gia Gunn sashays away."
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
      "sha256": "d0c2c8c81cf085c104443b430e50e5b9fcdb02c1a1e06cde46deb6c408298afd",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Milk and Trinity K. Bonet lip-sync to \"<a href=\"/wiki/What_a_Man_(song)\" title=\"What a Man (song)\">Whatta Man</a>\" by <a href=\"/wiki/Salt-n-Pepa\" class=\"mw-redirect\" title=\"Salt-n-Pepa\">Salt-n-Pepa</a> with <a href=\"/wiki/En_Vogue\" title=\"En Vogue\">En Vogue</a>. Trinity K. Bonet wins the lip-sync and Milk sashays away."
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
      "sha256": "d0c2c8c81cf085c104443b430e50e5b9fcdb02c1a1e06cde46deb6c408298afd",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "BenDeLaCreme and Darienne Lake lip-sync to \"<a href=\"/wiki/Point_of_No_Return_(Expos%C3%A9_song)\" title=\"Point of No Return (Exposé song)\">Point of No Return</a>\" by <a href=\"/wiki/Expos%C3%A9_(group)\" title=\"Exposé (group)\">Exposé</a>. Darienne  Lake is declared the winner of the lip-sync, but Ben is saved and no one goes home."
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
      "sha256": "d0c2c8c81cf085c104443b430e50e5b9fcdb02c1a1e06cde46deb6c408298afd",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Joslyn Fox and Laganja Estranja lip-sync to \"<a href=\"/wiki/Stupid_Girls\" title=\"Stupid Girls\">Stupid Girls</a>\" by <a href=\"/wiki/Pink_(singer)\" title=\"Pink (singer)\">Pink</a>. Joslyn Fox wins the lip-sync and Laganja Estranja sashays away."
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
      "sha256": "d0c2c8c81cf085c104443b430e50e5b9fcdb02c1a1e06cde46deb6c408298afd",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Adore Delano and Trinity K. Bonet lip-sync to \"<a href=\"/wiki/Vibeology\" title=\"Vibeology\">Vibeology</a>\" by <a href=\"/wiki/Paula_Abdul\" title=\"Paula Abdul\">Paula Abdul</a>. Adore Delano wins the lip-sync and Trinity K. Bonet sashays away."
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
      "sha256": "d0c2c8c81cf085c104443b430e50e5b9fcdb02c1a1e06cde46deb6c408298afd",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Adore Delano and Joslyn Fox lip-sync to \"<a href=\"/wiki/Think_(Aretha_Franklin_song)\" title=\"Think (Aretha Franklin song)\">Think</a>\" by <a href=\"/wiki/Aretha_Franklin\" title=\"Aretha Franklin\">Aretha Franklin</a>. Adore Delano wins the lip-sync and Joslyn Fox sashays away."
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
      "sha256": "d0c2c8c81cf085c104443b430e50e5b9fcdb02c1a1e06cde46deb6c408298afd",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "BenDeLaCreme and Darienne Lake lip-sync to \"<a href=\"/wiki/Stronger_(What_Doesn%27t_Kill_You)\" title=\"Stronger (What Doesn&#39;t Kill You)\">Stronger (What Doesn't Kill You)</a>\" by <a href=\"/wiki/Kelly_Clarkson\" title=\"Kelly Clarkson\">Kelly Clarkson</a>. Darienne Lake wins the lip-sync and BenDeLaCreme sashays away."
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
      "sha256": "c37415aa52557fda42a5e38371cf657208c6331d4b42c25973daff3100a789a5",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Kandy Ho and Tempest DuJour lip-sync to \"<a href=\"/wiki/Born_Naked\" title=\"Born Naked\">Geronimo</a>\" by <a href=\"/wiki/RuPaul\" title=\"RuPaul\">RuPaul</a>. Kandy Ho wins the lip-sync and Tempest DuJour is the first queen to sashay away."
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
      "sha256": "c37415aa52557fda42a5e38371cf657208c6331d4b42c25973daff3100a789a5",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Katya and Sasha Belle lip-sync to \"<a href=\"/wiki/Twist_of_Fate_(Olivia_Newton-John_song)\" title=\"Twist of Fate (Olivia Newton-John song)\">Twist of Fate</a>\" by <a href=\"/wiki/Olivia_Newton-John\" title=\"Olivia Newton-John\">Olivia Newton-John</a>. Katya wins the lip-sync and Sasha Belle sashays away."
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
      "sha256": "c37415aa52557fda42a5e38371cf657208c6331d4b42c25973daff3100a789a5",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Jasmine Masters and Kennedy Davenport lip-sync to \"<a href=\"/wiki/I_Was_Gonna_Cancel\" title=\"I Was Gonna Cancel\">I Was Gonna Cancel</a>\" by <a href=\"/wiki/Kylie_Minogue\" title=\"Kylie Minogue\">Kylie Minogue</a>. Kennedy Davenport wins the lip-sync and Jasmine Masters sashays away."
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
      "sha256": "c37415aa52557fda42a5e38371cf657208c6331d4b42c25973daff3100a789a5",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Pearl and Trixie Mattel lip-sync to \"<a href=\"/wiki/Dreaming_(Blondie_song)\" title=\"Dreaming (Blondie song)\">Dreaming</a>\" by <a href=\"/wiki/Blondie_(band)\" title=\"Blondie (band)\">Blondie</a>. Pearl wins the lip-sync and Trixie Mattel sashays away."
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
      "sha256": "c37415aa52557fda42a5e38371cf657208c6331d4b42c25973daff3100a789a5",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Kandy Ho and Mrs. Kasha Davis lip-sync to \"<a href=\"/wiki/Lovergirl\" title=\"Lovergirl\">Lovergirl</a>\" by <a href=\"/wiki/Teena_Marie\" title=\"Teena Marie\">Teena Marie</a>. Kandy Ho wins the lip-sync and Mrs. Kasha Davis sashays away."
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
      "artist": "Ariana Grande",
      "raw": "\"Break Free\" — Ariana Grande"
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
      "sha256": "c37415aa52557fda42a5e38371cf657208c6331d4b42c25973daff3100a789a5",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Jaidynn Diore Fierce and Kandy Ho lip-sync to \"<a href=\"/wiki/Break_Free_(Ariana_Grande_song)\" class=\"mw-redirect\" title=\"Break Free (Ariana Grande song)\">Break Free</a>\" by <a href=\"/wiki/Ariana_Grande\" title=\"Ariana Grande\">Ariana Grande</a>. Jaidynn Diore Fierce wins the lip-sync and Kandy Ho sashays away."
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
      "sha256": "c37415aa52557fda42a5e38371cf657208c6331d4b42c25973daff3100a789a5",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Jaidynn Diore Fierce and Max lip-sync to \"<a href=\"/wiki/Michel%27le_(album)\" title=\"Michel&#39;le (album)\">No More Lies</a>\" by <a href=\"/wiki/Michel%27le\" title=\"Michel&#39;le\">Michel'le</a>. Jaidynn Diore Fierce wins the lip-sync and Max sashays away."
    }
  },
  {
    "id": "s07-e08-1",
    "seasonId": "s07",
    "episode": 8,
    "sequence": 1,
    "type": "regular",
    "outcome": "single_winner",
    "song": {
      "title": "I Think We're Alone Now",
      "artist": "Tiffany",
      "raw": "\"I Think We're Alone Now\" — Tiffany"
    },
    "sides": [
      {
        "queens": [
          "ginger"
        ]
      },
      {
        "queens": [
          "jaidynn"
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
      "sha256": "c37415aa52557fda42a5e38371cf657208c6331d4b42c25973daff3100a789a5",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Ginger Minj and Jaidynn Diore Fierce lip-sync to \"<a href=\"/wiki/I_Think_We%27re_Alone_Now\" title=\"I Think We&#39;re Alone Now\">I Think We're Alone Now</a>\" by <a href=\"/wiki/Tiffany_Darwish\" title=\"Tiffany Darwish\">Tiffany</a> along with their conjoined twins Sasha Belle and Tempest DuJour, respectively. Ginger Minj wins the lip-sync and Jaidynn Diore Fierce sashays away."
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
      "sha256": "c37415aa52557fda42a5e38371cf657208c6331d4b42c25973daff3100a789a5",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Miss Fame and Pearl lip-sync to \"<a href=\"/wiki/Really_Don%27t_Care\" title=\"Really Don&#39;t Care\">Really Don't Care</a>\" by <a href=\"/wiki/Demi_Lovato\" title=\"Demi Lovato\">Demi Lovato</a> ft. <a href=\"/wiki/Cher_Lloyd\" title=\"Cher Lloyd\">Cher Lloyd</a>. Pearl wins the lip-sync and Miss Fame sashays away."
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
      "sha256": "c37415aa52557fda42a5e38371cf657208c6331d4b42c25973daff3100a789a5",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "They lip-sync to \"<a href=\"/wiki/Show_Me_Love_(Robin_S._song)\" title=\"Show Me Love (Robin S. song)\">Show Me Love</a>\" by <a href=\"/wiki/Robin_S.\" title=\"Robin S.\">Robin S.</a> Ginger Minj wins the lip-sync and Trixie Mattel sashays away."
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
      "sha256": "c37415aa52557fda42a5e38371cf657208c6331d4b42c25973daff3100a789a5",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "They lip-sync to \"<a href=\"/wiki/Roar_(song)\" title=\"Roar (song)\">Roar</a>\" by <a href=\"/wiki/Katy_Perry\" title=\"Katy Perry\">Katy Perry</a>. Kennedy Davenport wins the lip-sync and Katya sashays away."
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
      "sha256": "c37415aa52557fda42a5e38371cf657208c6331d4b42c25973daff3100a789a5",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "The four remaining queens lip-sync to \"<a href=\"/wiki/Born_Naked\" title=\"Born Naked\">Born Naked</a>\" by <a href=\"/wiki/RuPaul\" title=\"RuPaul\">RuPaul</a> ft. Clairy Browne. Kennedy Davenport is then eliminated, with Ginger Minj, Pearl and Violet Chachki being the finalists of the season."
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
      "sha256": "6ad786639b0a7e72ae3a9964450d8157c0c9e4f777e3595293357aa1876105a0",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Laila McQueen and Naysha Lopez lip-sync to \"<a href=\"/wiki/Applause_(Lady_Gaga_song)\" title=\"Applause (Lady Gaga song)\">Applause</a>\" by <a href=\"/wiki/Lady_Gaga\" title=\"Lady Gaga\">Lady Gaga</a>. Laila McQueen wins the lip-sync and Naysha Lopez is the first queen to sashay away."
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
      "sha256": "6ad786639b0a7e72ae3a9964450d8157c0c9e4f777e3595293357aa1876105a0",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Dax ExclamationPoint and Laila McQueen lip-sync to \"<a href=\"/wiki/I_Will_Survive\" title=\"I Will Survive\">I Will Survive</a>\" by <a href=\"/wiki/Gloria_Gaynor\" title=\"Gloria Gaynor\">Gloria Gaynor</a>. After the lip-sync, RuPaul decides to eliminate both Dax ExclamationPoint and Laila McQueen from the competition."
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
      "sha256": "6ad786639b0a7e72ae3a9964450d8157c0c9e4f777e3595293357aa1876105a0",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Cynthia Lee Fontaine and Robbie Turner lip-sync to \"<a href=\"/wiki/Mesmerized_(song)\" title=\"Mesmerized (song)\">Mesmerized</a> (Freemasons Radio Edit)\" by <a href=\"/wiki/Faith_Evans\" title=\"Faith Evans\">Faith Evans</a>. Robbie Turner wins the lip-sync and Cynthia Lee Fontaine sashays away."
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
      "sha256": "6ad786639b0a7e72ae3a9964450d8157c0c9e4f777e3595293357aa1876105a0",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Chi Chi DeVayne and Naysha Lopez lip-sync to \"<a href=\"/wiki/Call_Me_(Blondie_song)\" title=\"Call Me (Blondie song)\">Call Me</a>\" by <a href=\"/wiki/Blondie_(band)\" title=\"Blondie (band)\">Blondie</a>. Chi Chi DeVayne wins the lip-sync and Naysha Lopez sashays away."
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
      "sha256": "6ad786639b0a7e72ae3a9964450d8157c0c9e4f777e3595293357aa1876105a0",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Acid Betty and Naomi Smalls lip-sync to \"<a href=\"/wiki/Causing_a_Commotion\" title=\"Causing a Commotion\">Causing a Commotion</a>\" by <a href=\"/wiki/Madonna_(entertainer)\" class=\"mw-redirect\" title=\"Madonna (entertainer)\">Madonna</a>. Naomi Smalls wins the lip-sync and Acid Betty sashays away."
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
      "artist": "Icona Pop",
      "raw": "\"I Love It\" — Icona Pop"
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
      "sha256": "6ad786639b0a7e72ae3a9964450d8157c0c9e4f777e3595293357aa1876105a0",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Derrick Barry and Robbie Turner lip-sync to \"<a href=\"/wiki/I_Love_It_(Icona_Pop_song)\" title=\"I Love It (Icona Pop song)\">I Love It</a>\" by <a href=\"/wiki/Icona_Pop\" title=\"Icona Pop\">Icona Pop</a>. Derrick Barry wins the lip-sync and Robbie Turner sashays away."
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
      "sha256": "6ad786639b0a7e72ae3a9964450d8157c0c9e4f777e3595293357aa1876105a0",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "They lip-sync to \"<a href=\"/wiki/And_I_Am_Telling_You_I%27m_Not_Going\" title=\"And I Am Telling You I&#39;m Not Going\">And I Am Telling You I'm Not Going</a>\" from <a href=\"/wiki/Jennifer_Holliday\" title=\"Jennifer Holliday\">Jennifer Holliday</a>. Chi Chi DeVayne wins the lip-sync and Thorgy Thor sashays away."
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
      "sha256": "6ad786639b0a7e72ae3a9964450d8157c0c9e4f777e3595293357aa1876105a0",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "They lip-sync to \"<a href=\"/wiki/You_Make_Me_Feel_(Mighty_Real)\" title=\"You Make Me Feel (Mighty Real)\">You Make Me Feel (Mighty Real)</a>\" by <a href=\"/wiki/Sylvester_(singer)\" title=\"Sylvester (singer)\">Sylvester</a>. Bob the Drag Queen wins the lip-sync and Derrick Barry sashays away."
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
      "sha256": "6ad786639b0a7e72ae3a9964450d8157c0c9e4f777e3595293357aa1876105a0",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "The four remaining queens lip-sync to \"<a href=\"/wiki/Realness_(RuPaul_album)\" class=\"mw-redirect\" title=\"Realness (RuPaul album)\">The Realness</a>\" by <a href=\"/wiki/RuPaul\" title=\"RuPaul\">RuPaul</a>. Chi Chi DeVayne is then eliminated, with Bob the Drag Queen, Kim Chi and Naomi Smalls being the finalists of the season."
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
      "sha256": "d987aba41bcc1caa320004dd9b346320c57d0d8617e5e2a6a6ec2a111c6ffb80",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "<li><b>Bottom Two</b>: Jaymes Mansfield and Kimora Blac</li>\n<li><b>Lip-Sync Song</b>: \"<a href=\"/wiki/Love_Shack\" title=\"Love Shack\">Love Shack</a>\" by <a href=\"/wiki/The_B-52%27s\" class=\"mw-redirect\" title=\"The B-52&#39;s\">The B-52's</a></li>\n<li><span style=\"color:crimson\"><b>Eliminated:</b> Jaymes Mansfield</span></li>"
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
      "sha256": "d987aba41bcc1caa320004dd9b346320c57d0d8617e5e2a6a6ec2a111c6ffb80",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "<li><b>Bottom Two</b>: Aja and Kimora Blac</li>\n<li><b>Lip-Sync Song</b>:  \"<a href=\"/wiki/Holding_Out_for_a_Hero\" title=\"Holding Out for a Hero\">Holding Out for a Hero</a>\" by <a href=\"/wiki/Bonnie_Tyler\" title=\"Bonnie Tyler\">Bonnie Tyler</a></li>\n<li><span style=\"color:crimson\"><b>Eliminated:</b> Kimora Blac </span></li>"
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
      "sha256": "d987aba41bcc1caa320004dd9b346320c57d0d8617e5e2a6a6ec2a111c6ffb80",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Charlie Hides and Trinity Taylor lip-sync to \"<a href=\"/wiki/I_Wanna_Go\" title=\"I Wanna Go\">I Wanna Go</a>\" by <a href=\"/wiki/Britney_Spears\" title=\"Britney Spears\">Britney Spears</a>. Trinity Taylor wins the lip-sync and Charlie Hides sashays away."
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
      "sha256": "d987aba41bcc1caa320004dd9b346320c57d0d8617e5e2a6a6ec2a111c6ffb80",
      "fetchedAt": "2026-04-22T20:23:55.150Z",
      "quote": "Cynthia Lee Fontaine and Farrah Moan lip-sync to \"<a href=\"/wiki/Thank_You_(Meghan_Trainor_album)\" title=\"Thank You (Meghan Trainor album)\">Woman Up</a>\" by <a href=\"/wiki/Meghan_Trainor\" title=\"Meghan Trainor\">Meghan Trainor</a>. After the lip-sync, RuPaul reveals that Eureka will be leaving the competition due to her knee injury. She was given an open invitation to return next season. Because of this removal, Cynthia Lee Fontaine and Farrah Moan both win the lip-sync."
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
      "sha256": "d987aba41bcc1caa320004dd9b346320c57d0d8617e5e2a6a6ec2a111c6ffb80",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "<td>Cynthia Lee Fontaine\n</td>\n<td>vs.\n</td>\n<td>Peppermint\n</td>\n<td>\"<a href=\"/wiki/Music_(Madonna_song)\" title=\"Music (Madonna song)\">Music</a>\"<br />(<a href=\"/wiki/Madonna_(entertainer)\" class=\"mw-redirect\" title=\"Madonna (entertainer)\">Madonna</a>)\n</td>\n<td nowrap=\"\" bgcolor=\"lightgreen\"><b>Cynthia Lee Fontaine</b>"
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
      "sha256": "d987aba41bcc1caa320004dd9b346320c57d0d8617e5e2a6a6ec2a111c6ffb80",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "<td>Aja\n</td>\n<td>vs.\n</td>\n<td nowrap=\"\">Nina Bo'nina Brown\n</td>\n<td>\"<a href=\"/wiki/Finally_(CeCe_Peniston_song)\" title=\"Finally (CeCe Peniston song)\">Finally</a>\"<br />(<a href=\"/wiki/CeCe_Peniston\" title=\"CeCe Peniston\">CeCe Peniston</a>)\n</td>\n<td bgcolor=\"lightgreen\"><b>Aja</b>"
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
      "sha256": "d987aba41bcc1caa320004dd9b346320c57d0d8617e5e2a6a6ec2a111c6ffb80",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "<td>Alexis Michelle\n</td>\n<td>vs.\n</td>\n<td>Farrah Moan\n</td>\n<td>\"<a href=\"/wiki/Baby_I%27m_Burnin%27\" title=\"Baby I&#39;m Burnin&#39;\">Baby I'm Burnin'</a>\"<br />(<a href=\"/wiki/Dolly_Parton\" title=\"Dolly Parton\">Dolly Parton</a>)\n</td>\n<td bgcolor=\"lightgreen\"><b>Farrah Moan</b>"
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
      "sha256": "d987aba41bcc1caa320004dd9b346320c57d0d8617e5e2a6a6ec2a111c6ffb80",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "<td>Nina Bo'nina Brown\n</td>\n<td>vs.\n</td>\n<td>Valentina\n</td>\n<td>\"<a href=\"/wiki/Greedy_(Ariana_Grande_song)\" title=\"Greedy (Ariana Grande song)\">Greedy</a>\"<br />(<a href=\"/wiki/Ariana_Grande\" title=\"Ariana Grande\">Ariana Grande</a>)\n</td>\n<td bgcolor=\"lightblue\"><b>Valentina</b>"
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
      "sha256": "d987aba41bcc1caa320004dd9b346320c57d0d8617e5e2a6a6ec2a111c6ffb80",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "<td>Nina Bo'nina Brown\n</td>\n<td>vs.\n</td>\n<td>Shea Couleé\n</td>\n<td>\"<a href=\"/wiki/Cool_for_the_Summer\" title=\"Cool for the Summer\">Cool for the Summer</a>\"<br />(<a href=\"/wiki/Demi_Lovato\" title=\"Demi Lovato\">Demi Lovato</a>)\n</td>\n<td bgcolor=\"lightpink\"><b>Nina Bo'nina Brown</b>"
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
      "sha256": "d987aba41bcc1caa320004dd9b346320c57d0d8617e5e2a6a6ec2a111c6ffb80",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "<td>Alexis Michelle\n</td>\n<td>vs.\n</td>\n<td>Peppermint\n</td>\n<td>\"<a href=\"/wiki/Macho_Man_(song)\" title=\"Macho Man (song)\">Macho Man</a>\"<br />(<a href=\"/wiki/Village_People\" title=\"Village People\">Village People</a>)\n</td>\n<td bgcolor=\"lightgreen\"><b>Alexis Michelle</b>"
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
      "sha256": "d987aba41bcc1caa320004dd9b346320c57d0d8617e5e2a6a6ec2a111c6ffb80",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "<td>Peppermint\n</td>\n<td>vs.\n</td>\n<td>Trinity Taylor\n</td>\n<td>\"<a href=\"/wiki/Stronger_(Britney_Spears_song)\" title=\"Stronger (Britney Spears song)\">Stronger</a>\"<br />(Britney Spears)\n</td>\n<td bgcolor=\"violet\"><b>Peppermint</b>"
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
      "sha256": "d987aba41bcc1caa320004dd9b346320c57d0d8617e5e2a6a6ec2a111c6ffb80",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "<td>Sasha Velour\n</td>\n<td>vs.\n</td>\n<td>Shea Couleé\n</td>\n<td>\"<a href=\"/wiki/So_Emotional\" title=\"So Emotional\">So Emotional</a>\"<br />(<a href=\"/wiki/Whitney_Houston\" title=\"Whitney Houston\">Whitney Houston</a>)\n</td>\n<td bgcolor=\"violet\"><b>Sasha Velour</b>"
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
      "sha256": "d987aba41bcc1caa320004dd9b346320c57d0d8617e5e2a6a6ec2a111c6ffb80",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "<td>Peppermint\n</td>\n<td>vs.\n</td>\n<td>Sasha Velour\n</td>\n<td nowrap=\"\">\"<a href=\"/wiki/It%27s_Not_Right_But_It%27s_Okay\" class=\"mw-redirect\" title=\"It&#39;s Not Right But It&#39;s Okay\">It's Not Right But It's Okay</a> (<a href=\"/wiki/Thunderpuss\" title=\"Thunderpuss\">Thunderpuss</a> Remix)\"<br />(Whitney Houston)\n</td>\n<td bgcolor=\"#D4AF37\"><b>Sasha Velour</b>"
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "Kalorie Karbdashian Williams and Vanessa Vanjie Mateo lip-sync to \"Ain't No Other Man\" by Christina Aguilera. Kalorie Karbdashian Williams wins the lip-sync and Vanessa Vanjie Mateo sashays away."
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "Eureka and Kalorie Karbdashian Williams lip-sync to \"Best of My Love\" by The Emotions. Eureka wins the lip-sync and Kalorie Karbdashian Williams sashays away."
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "Mayhem Miller and Yuhua Hamasaki lip-sync to . Mayhem Miller wins the lip-sync and Yuhua Hamasaki sashays away."
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "Dusty Ray Bottoms and Monét X Change lip-sync to \"Pound the Alarm\" by Nicki Minaj. Monét X Change wins the lip-sync and Dusty Ray Bottoms sashays away."
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "Mayhem Miller and Monét X Change lip-sync to \"Man! I Feel Like A Woman!\" by Shania Twain. Monét X Change wins the lip-sync and Mayhem Miller sashays away."
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "Blair St. Clair and The Vixen lip-sync to \"I'm Coming Out\" by Diana Ross. The Vixen wins the lip-sync and Blair St. Clair sashays away."
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "Monique Heart and The Vixen lip-sync to \"Cut to the Feeling\" by Carly Rae Jepsen. The Vixen wins the lip-sync and Monique Heart sashays away."
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "Asia O'Hara and The Vixen lip-sync to \"Groove Is In the Heart\" by Deee-Lite. Asia O'Hara wins the lip-sync and The Vixen sashays away."
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "Eureka and Kameron Michaels lip-sync to \"New Attitude\" by Patti LaBelle. They are both declared the winners of the lip-sync and no one goes home."
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "Kameron Michaels and Monét X Change lip-sync to \"Good as Hell\" by Lizzo. Kameron Michaels wins the lip-sync and Monét X Change sashays away."
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "They lip-sync to \"Nasty Girl\" by Vanity 6. Kameron Michaels wins the lip-sync and Miz Cracker sashays away."
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "The first lip-sync is between Asia O'Hara and Kameron Michaels. They lip-sync to \"Nasty\" by Janet Jackson. Kameron Michaels wins the lip-sync and Asia O'Hara is eliminated."
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "The second lip-sync is between Aquaria and Eureka. They lip-sync to \"If\" by Janet Jackson. They both win the lip-sync and move on to the final round."
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
      "sha256": "1c8828d541db4c555d5d1a3c91292e70820509bdb749a7e7dc7f1fb0e15e41b1",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "The final lip-sync is between Aquaria, Eureka and Kameron Michaels. They lip-sync to \"Bang Bang\" by Ariana Grande, Jessie J, and Nicki Minaj. It is announced that Aquaria is the winner, leaving Eureka and Kameron Michaels as the runners-up."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "Kahanna Montrese and Soju lip-sync to \"The Best of Both Worlds\" by Hannah Montana. Kahanna Montrese wins the lip-sync and Soju is the first queen to sashay away."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "Kahanna Montrese and Mercedes Iman Diamond lip-sync to \"Work Bitch\" by Britney Spears. Mercedes Iman Diamond wins the lip-sync and Kahanna Montrese sashays away."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.151Z",
      "quote": "A'keria C. Davenport, Honey Davenport, Plastique Tiara, Ra'Jah O'Hara, Scarlet Envy and Shuga Cain being announced as the bottom six. They lip-sync to \"Waiting for Tonight (Hex Hector Mix)\" by Jennifer Lopez. A'keria C. Davenport, Plastique Tiara, Ra'Jah O'Hara, Scarlet Envy and Shuga Cain win the lip-sync and Honey Davenport sashays away."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Mercedes Iman Diamond and Ra'Jah O'Hara lip-sync to \"Living in America\" by James Brown. Ra'Jah O'Hara wins the lip-sync and Mercedes Iman Diamond sashays away."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Ariel Versace and Shuga Cain lip-sync to \"I'm Your Baby Tonight\" by Whitney Houston. Shuga Cain wins the lip-sync and Ariel Versace sashays away."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Ra'Jah O'Hara and Scarlet Envy lip-sync to \"Last Dance\" by Donna Summer. Ra'Jah O'Hara wins the lip-sync and Scarlet Envy sashays away."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "A'keria C. Davenport and Ra'Jah O'Hara lip-sync to \"Strut\" by Sheena Easton. A'keria C. Davenport wins the lip-sync and Ra'Jah O'Hara sashays away."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Brooke Lynn Hytes and Yvie Oddly lip-sync to \"Sorry Not Sorry\" by Demi Lovato. They are both declared the winners of the lip-sync and no one goes home."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Plastique Tiara and Vanessa Vanjie Mateo lip-sync to \"Hood Boy\" by Fantasia. Vanessa Vanjie Mateo wins the lip-sync and Plastique Tiara sashays away."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Shuga Cain and Vanessa Vanjie Mateo lip-sync to \"No More Drama\" by Mary J. Blige. Vanessa Vanjie Mateo wins the lip-sync and Shuga Cain sashays away."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Nina West and Silky Nutmeg Ganache lip-sync to \"No Scrubs\" by TLC. Silky Nutmeg Ganache wins the lip-sync and Nina West sashays away."
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
      "title": "Pride: A Deeper Love",
      "artist": "Aretha Franklin",
      "raw": "\"Pride: A Deeper Love\" — Aretha Franklin"
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Brooke Lynn Hytes and Vanessa Vanjie Mateo lip-sync to \"Pride: A Deeper Love\" by Aretha Franklin. Brooke Lynn Hytes wins the lip-sync and Vanessa Vanjie Mateo sashays away."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "The first lip-sync is between Brooke Lynn Hytes and Silky Nutmeg Ganache. They lip-sync to \"Bootylicious\" by Destiny's Child. Brooke Lynn Hytes wins the lip-sync and Silky Nutmeg Ganache is eliminated."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "The second lip-sync is between A'keria C. Davenport and Yvie Oddly. They lip-sync to \"SOS\" by Rihanna. Yvie Oddly wins the lip-sync and A'keria C. Davenport is eliminated."
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
      "sha256": "68bd07a4f5206817a830552cfbfa81b074b02af6a09b0242f7ff279f73be228c",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "The final lip-sync is between Brooke Lynn Hytes and Yvie Oddly. They lip-sync to \"The Edge of Glory\" by Lady Gaga. It is announced that Yvie Oddly is the winner, leaving Brooke Lynn Hytes as the runner-up."
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
      "sha256": "59a25a3d1a6f2ae88ca4db4d55f648d66c53db967b23a854249b5465e16e205d",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "It is then announced that Gigi Goode and Widow Von'Du are the top two queens of the week and will lip-sync for the win. They lip-sync to \"<a href=\"/wiki/Starships_(song)\" title=\"Starships (song)\">Starships</a>\" by <a href=\"/wiki/Nicki_Minaj\" title=\"Nicki Minaj\">Nicki Minaj</a>. After the lip-sync, Widow Von'Du is announced as the winner of the challenge. RuPaul then reveals that no one will be going home."
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
      "sha256": "59a25a3d1a6f2ae88ca4db4d55f648d66c53db967b23a854249b5465e16e205d",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "It is then announced that Jaida Essence Hall and Sherry Pie are the top two queens of the week and will lip-sync for the win. They lip-sync to \"<a href=\"/wiki/Call_Your_Girlfriend\" title=\"Call Your Girlfriend\">Call Your Girlfriend</a>\" by <a href=\"/wiki/Robyn\" title=\"Robyn\">Robyn</a>. After the lip-sync, Jaida Essence Hall is announced as the winner of the challenge. RuPaul then reveals that no one will be going home."
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
      "sha256": "59a25a3d1a6f2ae88ca4db4d55f648d66c53db967b23a854249b5465e16e205d",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Dahlia Sin and Nicky Doll lip-sync to \"<a href=\"/wiki/Problem_(Ariana_Grande_song)\" title=\"Problem (Ariana Grande song)\">Problem</a>\" by <a href=\"/wiki/Ariana_Grande\" title=\"Ariana Grande\">Ariana Grande</a> ft. <a href=\"/wiki/Iggy_Azalea\" title=\"Iggy Azalea\">Iggy Azalea</a>. Nicky Doll wins the lip-sync and Dahlia Sin is the first queen to sashay away."
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
      "sha256": "59a25a3d1a6f2ae88ca4db4d55f648d66c53db967b23a854249b5465e16e205d",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Brita and Rock M. Sakura lip-sync to \"<a href=\"/wiki/S%26M_(song)\" title=\"S&amp;M (song)\">S&amp;M</a>\" by <a href=\"/wiki/Rihanna\" title=\"Rihanna\">Rihanna</a>. Brita wins the lip-sync and Rock M. Sakura sashays away."
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
      "sha256": "59a25a3d1a6f2ae88ca4db4d55f648d66c53db967b23a854249b5465e16e205d",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Heidi N Closet and Nicky Doll lip-sync to \"<a href=\"/wiki/Heart_to_Break\" title=\"Heart to Break\">Heart to Break</a>\" by <a href=\"/wiki/Kim_Petras\" title=\"Kim Petras\">Kim Petras</a>. Heidi N Closet wins the lip-sync and Nicky Doll sashays away."
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
      "sha256": "59a25a3d1a6f2ae88ca4db4d55f648d66c53db967b23a854249b5465e16e205d",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Aiden Zhane and Brita lip-sync to \"<a href=\"/wiki/Let_It_Go\" title=\"Let It Go\">Let It Go</a>\" by <a href=\"/wiki/Caissie_Levy\" title=\"Caissie Levy\">Caissie Levy</a>. Brita wins the lip-sync and Aiden Zhane sashays away."
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
      "sha256": "59a25a3d1a6f2ae88ca4db4d55f648d66c53db967b23a854249b5465e16e205d",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Brita and Heidi N Closet lip-sync to \"<a href=\"/wiki/Burning_Up_(Madonna_song)\" title=\"Burning Up (Madonna song)\">Burning Up</a>\" by <a href=\"/wiki/Madonna_(entertainer)\" class=\"mw-redirect\" title=\"Madonna (entertainer)\">Madonna</a>. Heidi N Closet wins the lip-sync and Brita sashays away."
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
      "sha256": "59a25a3d1a6f2ae88ca4db4d55f648d66c53db967b23a854249b5465e16e205d",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Jan and Widow Von'Du lip-sync to \"<a href=\"/wiki/This_Is_My_Night\" title=\"This Is My Night\">This Is My Night</a>\" by <a href=\"/wiki/Chaka_Khan\" title=\"Chaka Khan\">Chaka Khan</a>. Widow Von'Du wins the lip-sync and Jan sashays away."
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
      "sha256": "59a25a3d1a6f2ae88ca4db4d55f648d66c53db967b23a854249b5465e16e205d",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Jackie Cox and Widow Von'Du lip-sync to \"<a href=\"/wiki/Firework_(song)\" title=\"Firework (song)\">Firework</a>\" by <a href=\"/wiki/Katy_Perry\" title=\"Katy Perry\">Katy Perry</a>. Jackie Cox wins the lip-sync and Widow Von'Du sashays away."
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
      "sha256": "59a25a3d1a6f2ae88ca4db4d55f648d66c53db967b23a854249b5465e16e205d",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Heidi N Closet and Jackie Cox receive negative critiques, and are announced as the bottom two. They lip-sync to \"<a href=\"/wiki/Kill_the_Lights_(Alex_Newell_%26_DJ_Cassidy_song)\" class=\"mw-redirect\" title=\"Kill the Lights (Alex Newell &amp; DJ Cassidy song)\">Kill the Lights</a>\" by <a href=\"/wiki/Alex_Newell\" title=\"Alex Newell\">Alex Newell</a> and <a href=\"/wiki/DJ_Cassidy\" title=\"DJ Cassidy\">DJ Cassidy</a> ft. <a href=\"/wiki/Nile_Rodgers\" title=\"Nile Rodgers\">Nile Rodgers</a>. They are both declared the winners of the lip-sync and no one goes home."
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
      "sha256": "59a25a3d1a6f2ae88ca4db4d55f648d66c53db967b23a854249b5465e16e205d",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Heidi N Closet and Jaida Essence Hall lip-sync to \"<a href=\"/wiki/1999_(Prince_song)\" title=\"1999 (Prince song)\">1999</a>\" by <a href=\"/wiki/Prince_(musician)\" title=\"Prince (musician)\">Prince</a>. Jaida Essence Hall wins the lip-sync and Heidi N Closet sashays away."
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
      "sha256": "59a25a3d1a6f2ae88ca4db4d55f648d66c53db967b23a854249b5465e16e205d",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "Crystal Methyd and Jackie Cox receive negative critiques, and are announced as the bottom two. They lip-sync to \"On the Floor\" by Jennifer Lopez ft. Pitbull. Crystal Methyd wins the lip-sync and Jackie Cox sashays away."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "The first two queens, Joey Jay and Kandy Muse lip-sync to \"<a href=\"/wiki/Call_Me_Maybe\" title=\"Call Me Maybe\">Call Me Maybe</a>\" by <a href=\"/wiki/Carly_Rae_Jepsen\" title=\"Carly Rae Jepsen\">Carly Rae Jepsen</a>. Kandy Muse wins the lip-sync and Joey Jay loses."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "The next two queens, Denali and LaLa Ri, lip-sync to \"<a href=\"/wiki/When_I_Grow_Up_(The_Pussycat_Dolls_song)\" title=\"When I Grow Up (The Pussycat Dolls song)\">When I Grow Up</a>\" by <a href=\"/wiki/The_Pussycat_Dolls\" title=\"The Pussycat Dolls\">The Pussycat Dolls</a>. LaLa Ri wins the lip-sync and Denali loses."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.152Z",
      "quote": "The next two queens, Symone and Tamisha Iman, lip-sync to \"<a href=\"/wiki/The_Pleasure_Principle_(song)\" title=\"The Pleasure Principle (song)\">The Pleasure Principle</a>\" by <a href=\"/wiki/Janet_Jackson\" title=\"Janet Jackson\">Janet Jackson</a>. Symone wins the lip-sync and Tamisha Iman loses."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "The next two queens, Gottmik and Utica Queen, lip-sync to \"<a href=\"/wiki/Rumors_(Lindsay_Lohan_song)\" title=\"Rumors (Lindsay Lohan song)\">Rumors</a>\" by <a href=\"/wiki/Lindsay_Lohan\" title=\"Lindsay Lohan\">Lindsay Lohan</a>. Gottmik wins the lip-sync and Utica Queen loses."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "The next two queens, Olivia Lux and Rosé lip-sync to \"<a href=\"/wiki/Ex%27s_%26_Oh%27s\" title=\"Ex&#39;s &amp; Oh&#39;s\">Ex's &amp; Oh's</a>\". Olivia Lux wins the lip-sync and Rosé loses."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "The final three queens, Elliott with 2 Ts, Kahmora Hall and Tina Burner lip-sync to \"<a href=\"/wiki/Lady_Marmalade\" title=\"Lady Marmalade\">Lady Marmalade</a>\" by <a href=\"/wiki/Christina_Aguilera\" title=\"Christina Aguilera\">Christina Aguilera</a>, <a href=\"/wiki/Lil%27_Kim\" title=\"Lil&#39; Kim\">Lil' Kim</a>, <a href=\"/wiki/M%C3%BDa\" class=\"mw-redirect\" title=\"Mýa\">Mýa</a>, <a href=\"/wiki/Pink_(singer)\" title=\"Pink (singer)\">Pink</a>. Tina Burner wins the lip-sync and Elliott with 2 Ts and Kahmora Hall lose."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "It is announced that Olivia Lux and Symone are the top two queens of the week and will lip-sync for the win. They lip-sync to \"<a href=\"/wiki/Break_My_Heart_(Dua_Lipa_song)\" title=\"Break My Heart (Dua Lipa song)\">Break My Heart</a>\" by <a href=\"/wiki/Dua_Lipa\" title=\"Dua Lipa\">Dua Lipa</a>. After the lip-sync, it is announced that Symone is the winner."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "It is announced that Denali and Rosé are the top two queens of the week and will lip-sync for the win. They lip-sync to \"<a href=\"/wiki/If_U_Seek_Amy\" title=\"If U Seek Amy\">If U Seek Amy</a>\" by <a href=\"/wiki/Britney_Spears\" title=\"Britney Spears\">Britney Spears</a>. After the lip-sync, it is announced that Denali is the winner."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Denali and Kahmora Hall lip-sync to \"<a href=\"/wiki/100%25_Pure_Love\" title=\"100% Pure Love\">100% Pure Love</a> by <a href=\"/wiki/Crystal_Waters\" title=\"Crystal Waters\">Crystal Waters</a>. Denali wins the lip-sync and Kahmora Hall is the first queen to sashay away."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Joey Jay and LaLa Ri lip-sync to \"<a href=\"/wiki/Fancy_(Iggy_Azalea_song)\" title=\"Fancy (Iggy Azalea song)\">Fancy</a>\" by <a href=\"/wiki/Iggy_Azalea\" title=\"Iggy Azalea\">Iggy Azalea</a> ft. <a href=\"/wiki/Charli_XCX\" title=\"Charli XCX\">Charli XCX</a>. LaLa Ri wins the lip-sync and Joey Jay sashays away."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Kandy Muse and Tamisha Iman lip-sync to \"<a href=\"/wiki/Hit_%27Em_Up_Style_(Oops!)\" title=\"Hit &#39;Em Up Style (Oops!)\">Hit 'Em Up Style (Oops!)</a>\" by <a href=\"/wiki/Blu_Cantrell\" title=\"Blu Cantrell\">Blu Cantrell</a>. Kandy Muse wins the lip-sync and Tamisha Iman sashays away."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Elliott with 2 Ts and LaLa Ri lip-sync to \"<a href=\"/wiki/Whole_Lotta_Woman_(Kelly_Clarkson_song)\" title=\"Whole Lotta Woman (Kelly Clarkson song)\">Whole Lotta Woman</a>\" by <a href=\"/wiki/Kelly_Clarkson\" title=\"Kelly Clarkson\">Kelly Clarkson</a>. Elliott with 2 Ts wins the lip-sync and LaLa Ri sashays away."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Kandy Muse and Symone lip-sync to \"<a href=\"/wiki/Boss_(Fifth_Harmony_song)\" title=\"Boss (Fifth Harmony song)\">Boss</a>\" by <a href=\"/wiki/Fifth_Harmony\" title=\"Fifth Harmony\">Fifth Harmony</a>. Symone is declared the winner of the lip sync and Kandy is asked to sashay away. However, just before Kandy exits, RuPaul tells her that she is safe to slay another day and is allowed to remain in the competition."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Elliott with 2 Ts and Utica Queen lip-sync to \"<a href=\"/wiki/Fascinated_(Company_B_song)\" title=\"Fascinated (Company B song)\">Fascinated</a>\" by <a href=\"/wiki/Company_B_(band)\" title=\"Company B (band)\">Company B</a>. Utica Queen wins the lip-sync and Elliott with 2 Ts sashays away."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Denali and Olivia Lux lip-sync to \"<a href=\"/wiki/Shackles_(Praise_You)\" title=\"Shackles (Praise You)\">Shackles (Praise You)</a>\" by <a href=\"/wiki/Mary_Mary\" title=\"Mary Mary\">Mary Mary</a>. Olivia Lux wins the lip-sync and Denali sashays away."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Tina Burner and Utica Queen lip-sync to \"<a href=\"/wiki/My_Humps\" title=\"My Humps\">My Humps</a>\" by <a href=\"/wiki/Black_Eyed_Peas\" title=\"Black Eyed Peas\">Black Eyed Peas</a>. Utica Queen wins the lip-sync and Tina Burner sashays away."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Symone and Utica Queen lip-sync to \"<a href=\"/wiki/No_Tears_Left_To_Cry\" class=\"mw-redirect\" title=\"No Tears Left To Cry\">No Tears Left To Cry</a>\" by <a href=\"/wiki/Ariana_Grande\" title=\"Ariana Grande\">Ariana Grande</a>. Symone wins the lip-sync and Utica Queen sashays away."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "They lip-sync to \"<a href=\"/wiki/Strong_Enough_(Cher_song)\" title=\"Strong Enough (Cher song)\">Strong Enough</a>\" by <a href=\"/wiki/Cher\" title=\"Cher\">Cher</a>. Kandy Muse wins the lip-sync and Olivia Lux sashays away."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Denali and LaLa Ri are both awarded this season's \"Lip-Sync Assassins\" and will battle in a lip-sync for a charity of their own choosing. They lip-sync to \"<a href=\"/wiki/Be_My_Lover_(La_Bouche_song)\" title=\"Be My Lover (La Bouche song)\">Be My Lover</a>\" by <a href=\"/wiki/La_Bouche\" title=\"La Bouche\">La Bouche</a>. Denali wins the lip-sync and wins $10,000 for her charity"
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "The first lip-sync is between Kandy Muse and Rosé. They lip-sync to \"<a href=\"/wiki/Work_Bitch\" title=\"Work Bitch\">Work Bitch</a>\" by <a href=\"/wiki/Britney_Spears\" title=\"Britney Spears\">Britney Spears</a>. Kandy Muse wins the lip-sync and Rosé is eliminated."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "The second lip-sync is between Gottmik and Symone. They lip-sync to \"<a href=\"/wiki/Gimme_More\" title=\"Gimme More\">Gimme More</a>\" by <a href=\"/wiki/Britney_Spears\" title=\"Britney Spears\">Britney Spears</a>. Symone wins the lip-sync and Gottmik is eliminated."
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
      "sha256": "c3f65d307b1fa8ba3fc967705cd8a5c12389e2aa5a384e2961ca89351552c045",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "The final lip-sync is between Kandy Muse and Symone. They lip-sync to \"<a href=\"/wiki/Till_the_World_Ends\" title=\"Till the World Ends\">Till the World Ends</a>\" by <a href=\"/wiki/Britney_Spears\" title=\"Britney Spears\">Britney Spears</a>. It is announced that Symone is the winner, leaving Kandy Muse as the runner-up."
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "<li><b>Bottom Two:</b> June Jambalaya and Orion Story</li>\n<li><b>Lip-Sync Song:</b> \"<a href=\"/wiki/Water_Me_(Lizzo_song)\" title=\"Water Me (Lizzo song)\">Water Me</a>\" by <a href=\"/wiki/Lizzo\" title=\"Lizzo\">Lizzo</a></li>\n<li><span style=\"color:crimson\"><b>Eliminated:</b> Orion Story</span></li>"
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Daya Betty and DeJa Skye lip-sync to \"Fallin’\" by Alicia Keys. DeJa Skye wins the lip-sync and Daya Betty sashays away."
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "June Jambalaya and Maddy Morphosis lip-sync to \"<a href=\"/wiki/I_Love_It_(Kylie_Minogue_song)\" title=\"I Love It (Kylie Minogue song)\">I Love It</a>\" by <a href=\"/wiki/Kylie_Minogue\" title=\"Kylie Minogue\">Kylie Minogue</a>. Maddy Morphosis wins the lip-sync. June Jambalaya then opens her chocolate bar to reveal a plain chocolate bar and sashays away."
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Alyssa Hunter and Kerri Colby lip-sync to \"<a href=\"/wiki/Play_(Jennifer_Lopez_song)\" title=\"Play (Jennifer Lopez song)\">Play</a>\" by <a href=\"/wiki/Jennifer_Lopez\" title=\"Jennifer Lopez\">Jennifer Lopez</a>. Kerri Colby wins the lip-sync. Alyssa Hunter then opens her chocolate bar to reveal a plain chocolate bar and sashays away."
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Jorgeous and Orion Story lip-sync to \"<a href=\"/wiki/My_Head_%26_My_Heart\" title=\"My Head &amp; My Heart\">My Head &amp; My Heart</a> by <a href=\"/wiki/Ava_Max\" title=\"Ava Max\">Ava Max</a>. Jorgeous wins the lip-sync. Orion Story then opens her chocolate bar to reveal a plain chocolate bar and sashays away."
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.153Z",
      "quote": "Jasmine Kennedie and Maddy Morphosis lip-sync to \"<a href=\"/wiki/Suga_Mama\" title=\"Suga Mama\">Suga Mama</a>\" by <a href=\"/wiki/Beyonc%C3%A9\" title=\"Beyoncé\">Beyoncé</a>. Jasmine Kennedie wins the lip-sync. Maddy Morphosis then opens her chocolate bar to reveal a plain chocolate bar, and sashays away."
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "It is then revealed that Daya Betty and Lady Camden are the top two queens of the week and lip-sync for the win. They lip-sync to \"<a href=\"/wiki/One_Way_or_Another\" title=\"One Way or Another\">One Way or Another</a>\" by <a href=\"/wiki/Blondie_(band)\" title=\"Blondie (band)\">Blondie</a>. After the lip-sync, Lady Camden is announced as the winner of the challenge. RuPaul then announces that no one is going home."
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Jasmine Kennedie and Kerri Colby lip-sync to \"<a href=\"/wiki/Un-Break_My_Heart\" title=\"Un-Break My Heart\">Un-Break My Heart</a>\" (Soul-Hex Radio Mix) by <a href=\"/wiki/Toni_Braxton\" title=\"Toni Braxton\">Toni Braxton</a>. Jasmine Kennedie wins the lip-sync. Kerri Colby then opens her chocolate bar to reveal a plain chocolate bar, and sashays away."
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Jasmine Kennedie and Jorgeous lip-sync to \"Something's Got a Hold on Me\" by Etta James. Both queens win the lip-sync and no one goes home."
    }
  },
  {
    "id": "s14-e11-lala-r1-1",
    "seasonId": "s14",
    "episode": 11,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "In the first round, Jasmine Kennedie gets picked first and chooses Daya Betty to lip-sync against. Daya Betty then chooses \"<a href=\"/wiki/Respect_(song)\" title=\"Respect (song)\">Respect</a>\" by <a href=\"/wiki/Aretha_Franklin\" title=\"Aretha Franklin\">Aretha Franklin</a>. Daya Betty wins the lip-sync and Jasmine Kennedie loses."
    }
  },
  {
    "id": "s14-e11-lala-r1-2",
    "seasonId": "s14",
    "episode": 11,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Willow Pill is next to be picked, and chooses Bosco to lip-sync against. Bosco chooses \"<a href=\"/wiki/Never_Too_Much_(song)\" title=\"Never Too Much (song)\">Never Too Much</a>\" by <a href=\"/wiki/Luther_Vandross\" title=\"Luther Vandross\">Luther Vandross</a>. Willow Pill wins the lip-sync and Bosco loses."
    }
  },
  {
    "id": "s14-e11-lala-r1-3",
    "seasonId": "s14",
    "episode": 11,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "The final three queens, Angeria Paris VanMicheals, Jorgeous and Lady Camden, will lip-sync last. The pit crew chooses Jorgeous' name and she picks \"<a href=\"/wiki/Radio_(Beyonc%C3%A9_song)\" title=\"Radio (Beyoncé song)\">Radio</a>\" by <a href=\"/wiki/Beyonc%C3%A9\" title=\"Beyoncé\">Beyoncé</a> to lip-sync to. Jorgeous wins the lip-sync and Angeria Paris VanMicheals and Lady Camden lose."
    }
  },
  {
    "id": "s14-e11-lala-r2-1",
    "seasonId": "s14",
    "episode": 11,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "In the second round, Lady Camden gets picked first and chooses Bosco to lip-sync against. Bosco chooses \"Don't Let Go (Love)\" by En Vogue. Lady Camden wins the lip-sync and Bosco loses."
    }
  },
  {
    "id": "s14-e11-lala-r2-2",
    "seasonId": "s14",
    "episode": 11,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Angeria Paris VanMicheals and Jasmine Kennedie then lip-sync to \"Love Don't Cost a Thing\" by Jennifer Lopez. Angeria Paris VanMicheals wins the lip-sync and Jasmine Kennedie loses."
    }
  },
  {
    "id": "s14-e11-lala-final-1",
    "seasonId": "s14",
    "episode": 11,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "In the final round, Bosco and Jasmine Kennedie lip-sync to \"<a href=\"/wiki/Swept_Away_(Diana_Ross_song)\" class=\"mw-redirect\" title=\"Swept Away (Diana Ross song)\">Swept Away</a>\" by <a href=\"/wiki/Diana_Ross\" title=\"Diana Ross\">Diana Ross</a>. Bosco wins the lip-sync. Jasmine Kennedie then opens her chocolate bar to reveal a plain chocolate bar and sashays away."
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Bosco and Jorgeous lip-sync to \"<a href=\"/wiki/Heartbreak_Hotel_(Whitney_Houston_song)\" title=\"Heartbreak Hotel (Whitney Houston song)\">Heartbreak Hotel</a>\" (Hex Hector Remix) by <a href=\"/wiki/Whitney_Houston\" title=\"Whitney Houston\">Whitney Houston</a> featuring <a href=\"/wiki/Faith_Evans\" title=\"Faith Evans\">Faith Evans</a> and <a href=\"/wiki/Kelly_Price\" title=\"Kelly Price\">Kelly Price</a>. Jorgeous wins the lip-sync. Bosco then opens her chocolate bar to reveal the gold chocolate bar, and is saved from elimination."
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Daya Betty, DeJa Skye and Jorgeous receive negative critiques, and are announced as the bottom three. They lip-sync to \"<a href=\"/wiki/Good_4_U\" title=\"Good 4 U\">Good 4 U</a>\" by <a href=\"/wiki/Olivia_Rodrigo\" title=\"Olivia Rodrigo\">Olivia Rodrigo</a>. Daya Betty wins the lip-sync and DeJa Skye and Jorgeous sashay away."
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Angeria Paris VanMicheals and Willow Pill lip-sync to \"<a href=\"/wiki/Telephone_(song)\" title=\"Telephone (song)\">Telephone</a>\" by <a href=\"/wiki/Lady_Gaga\" title=\"Lady Gaga\">Lady Gaga</a> ft. <a href=\"/wiki/Beyonc%C3%A9\" title=\"Beyoncé\">Beyoncé</a>. Both queens win the lip-sync and no one goes home."
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
      "sha256": "50437e17f72f8901a16fcad5502ed515aaa92ad85a872e72ecdd6a764c5fed21",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Lady Camden and Willow Pill lip-sync to \"<a href=\"/wiki/Gimme!_Gimme!_Gimme!_(A_Man_After_Midnight)#Cher_version\" title=\"Gimme! Gimme! Gimme! (A Man After Midnight)\">Gimme! Gimme! Gimme! (A Man After Midnight)</a>\" by <a href=\"/wiki/Cher\" title=\"Cher\">Cher</a>. It is announced that Willow Pill is the winner, leaving Lady Camden as the runner-up."
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Amethyst and Irene Dubois lip-sync to \"<a href=\"/wiki/7_Rings\" title=\"7 Rings\">7 Rings</a>\" by <a href=\"/wiki/Ariana_Grande\" title=\"Ariana Grande\">Ariana Grande</a>. Amethyst wins the lip-sync and Irene Dubois is the first queen to sashay away."
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Amethyst and Princess Poppy lip-sync to \"<a href=\"/wiki/Ain%27t_No_Mountain_High_Enough\" title=\"Ain&#39;t No Mountain High Enough\">Ain't No Mountain High Enough</a>\" by <a href=\"/wiki/Diana_Ross\" title=\"Diana Ross\">Diana Ross</a>. Amethyst wins the lip-sync and Princess Poppy sashays away."
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Spice and Sugar lip-sync to \"<a href=\"/wiki/You_Better_Run\" title=\"You Better Run\">You Better Run</a>\" by <a href=\"/wiki/Pat_Benatar\" title=\"Pat Benatar\">Pat Benatar</a>. Spice wins the lip-sync and Sugar sashays away."
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Amethyst and Salina EsTitties lip-sync to \"<a href=\"/wiki/Q.U.E.E.N.\" title=\"Q.U.E.E.N.\">Q.U.E.E.N.</a>\" by <a href=\"/wiki/Janelle_Mon%C3%A1e\" title=\"Janelle Monáe\">Janelle Monáe</a> ft. <a href=\"/wiki/Erykah_Badu\" title=\"Erykah Badu\">Erykah Badu</a>. Salina EsTitties wins the lip-sync and Amethyst sashays away."
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Jax and Robin Fierce lip-sync to \"<a href=\"/wiki/In_Your_Room_(The_Bangles_song)\" title=\"In Your Room (The Bangles song)\">In Your Room</a>\" by <a href=\"/wiki/The_Bangles\" title=\"The Bangles\">The Bangles</a>. Jax wins the lip-sync and Robin Fierce sashays away."
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Aura Mayari and Jax lip-sync to \"<a href=\"/wiki/Sweetest_Pie\" title=\"Sweetest Pie\">Sweetest Pie</a>\" by <a href=\"/wiki/Megan_Thee_Stallion\" title=\"Megan Thee Stallion\">Megan Thee Stallion</a> and <a href=\"/wiki/Dua_Lipa\" title=\"Dua Lipa\">Dua Lipa</a>. Jax wins the lip-sync and Aura Mayari sashays away."
    }
  },
  {
    "id": "s15-e08-lala-r1-1",
    "seasonId": "s15",
    "episode": 8,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Malaysia Babydoll Foxx gets picked first and chooses Marcia Marcia Marcia to lip-sync against. Marcia Marcia Marcia then chooses \"<a href=\"/wiki/Boys_Don%27t_Cry_(Anitta_song)\" title=\"Boys Don&#39;t Cry (Anitta song)\">Boys Don't Cry</a>\" by <a href=\"/wiki/Anitta_(singer)\" title=\"Anitta (singer)\">Anitta</a>. Marcia Marcia Marcia wins the lip-sync and Malaysia Babydoll Foxx loses."
    }
  },
  {
    "id": "s15-e08-lala-r1-2",
    "seasonId": "s15",
    "episode": 8,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Loosey LaDuca is next to be picked and chooses Spice to lip-sync against. Spice then chooses \"<a href=\"/wiki/Do_You_Wanna_Touch_Me#Joan_Jett_version\" title=\"Do You Wanna Touch Me\">Do You Wanna Touch Me</a>\" by <a href=\"/wiki/Joan_Jett\" title=\"Joan Jett\">Joan Jett</a>. Loosey LaDuca wins the lip-sync and Spice loses."
    }
  },
  {
    "id": "s15-e08-lala-r1-3",
    "seasonId": "s15",
    "episode": 8,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Luxx Noir London is next to be picked and chooses Salina EsTitties to lip-sync against. Salina EsTitties then chooses \"<a href=\"/wiki/It%27s_All_Coming_Back_to_Me_Now\" title=\"It&#39;s All Coming Back to Me Now\">It's All Coming Back to Me Now</a>\" by <a href=\"/wiki/C%C3%A9line_Dion\" class=\"mw-redirect\" title=\"Céline Dion\">Céline Dion</a>. Salina EsTitties wins the lip-sync and Luxx Noir London loses."
    }
  },
  {
    "id": "s15-e08-lala-r1-4",
    "seasonId": "s15",
    "episode": 8,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Mistress Isabelle Brooks is next to be picked and chooses Jax to lip-sync against. Jax then chooses \"<a href=\"/wiki/Tell_It_to_My_Heart_(Taylor_Dayne_song)\" title=\"Tell It to My Heart (Taylor Dayne song)\">Tell It to My Heart</a>\" by <a href=\"/wiki/Taylor_Dayne\" title=\"Taylor Dayne\">Taylor Dayne</a>. Mistress Isabelle Brooks wins the lip-sync and Jax loses."
    }
  },
  {
    "id": "s15-e08-lala-r1-5",
    "seasonId": "s15",
    "episode": 8,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "The final two queens, Anetra and Sasha Colby, lip-sync to \"<a href=\"/wiki/I%27m_in_Love_with_a_Monster\" title=\"I&#39;m in Love with a Monster\">I'm in Love with a Monster</a>\" by <a href=\"/wiki/Fifth_Harmony\" title=\"Fifth Harmony\">Fifth Harmony</a>. Sasha Colby wins the lip-sync and Anetra loses."
    }
  },
  {
    "id": "s15-e08-lala-r2-1",
    "seasonId": "s15",
    "episode": 8,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Malaysia Babydoll Foxx gets picked first and chooses Spice to lip-sync against. Spice then chooses \"<a href=\"/wiki/Don%27t_Go_Yet\" title=\"Don&#39;t Go Yet\">Don't Go Yet</a>\" by <a href=\"/wiki/Camila_Cabello\" title=\"Camila Cabello\">Camila Cabello</a>. Malaysia Babydoll Foxx wins the lip-sync and Spice loses."
    }
  },
  {
    "id": "s15-e08-lala-r2-2",
    "seasonId": "s15",
    "episode": 8,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "The final three queens, Anetra, Jax and Luxx Noir London, lip-sync to \"<a href=\"/wiki/The_Right_Stuff_(Vanessa_Williams_song)\" title=\"The Right Stuff (Vanessa Williams song)\">The Right Stuff</a>\" by <a href=\"/wiki/Vanessa_Williams\" title=\"Vanessa Williams\">Vanessa Williams</a>. Luxx Noir London wins the lip-sync and Anetra and Jax both lose."
    }
  },
  {
    "id": "s15-e08-lala-final-1",
    "seasonId": "s15",
    "episode": 8,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Anetra and Jax then lip-sync to \"<a href=\"/wiki/Finally_(CeCe_Peniston_song)\" title=\"Finally (CeCe Peniston song)\">Finally</a>\" by <a href=\"/wiki/CeCe_Peniston\" title=\"CeCe Peniston\">CeCe Peniston</a>. Anetra wins the lip-sync and Jax sashays away."
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Salina EsTitties and Spice lip-sync to \"<a href=\"/wiki/Thats_What_I_Want\" title=\"Thats What I Want\">Thats What I Want</a>\" by <a href=\"/wiki/Lil_Nas_X\" title=\"Lil Nas X\">Lil Nas X</a>. Salina EsTitties wins the lip-sync and Spice sashays away."
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Malaysia Babydoll Foxx and Salina EsTitties lip-sync to \"<a href=\"/wiki/Single_Ladies_(Put_a_Ring_on_It)\" title=\"Single Ladies (Put a Ring on It)\">Single Ladies (Put a Ring on It)</a>\" by <a href=\"/wiki/Beyonc%C3%A9\" title=\"Beyoncé\">Beyoncé</a>. Salina EsTitties wins the lip-sync and Malaysia Babydoll Foxx sashays away."
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Anetra and Marcia Marcia Marcia lip-sync to \"<a href=\"/wiki/Boss_Bitch\" title=\"Boss Bitch\">Boss Bitch</a>\" by <a href=\"/wiki/Doja_Cat\" title=\"Doja Cat\">Doja Cat</a>. Anetra wins the lip-sync and Marcia Marcia Marcia sashays away."
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Loosey LaDuca and Salina EsTitties receive negative critiques, and are announced as the bottom two. They lip-sync to . Loosey LaDuca wins the lip-sync and Salina EsTitties sashays away."
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Loosey LaDuca and Luxx Noir London receive negative critiques, and are announced as the bottom two. They lip-sync to \"<a href=\"/wiki/For_the_Girls_(song)\" title=\"For the Girls (song)\">For the Girls</a>\" by <a href=\"/wiki/Hayley_Kiyoko\" title=\"Hayley Kiyoko\">Hayley Kiyoko</a>. Luxx Noir London wins the lip-sync and Loosey LaDuca sashays away."
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Anetra and Mistress Isabelle Brooks receive negative critiques, and are announced as the bottom two. They lip-sync to \"<a href=\"/wiki/When_Love_Takes_Over\" title=\"When Love Takes Over\">When Love Takes Over</a>\" by <a href=\"/wiki/David_Guetta\" title=\"David Guetta\">David Guetta</a> ft. <a href=\"/wiki/Kelly_Rowland\" title=\"Kelly Rowland\">Kelly Rowland</a>. Both queens win the lip-sync and no one goes home."
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
      "sha256": "70eedd3b55b716eb2a287eedc30f3846d155f6cdb7509a83691c05e7efed040b",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "Anetra and Sasha Colby lip-sync to \"<a href=\"/wiki/Knock_on_Wood_(Amii_Stewart_song)\" class=\"mw-redirect\" title=\"Knock on Wood (Amii Stewart song)\">Knock on Wood</a>\" by <a href=\"/wiki/Amii_Stewart\" title=\"Amii Stewart\">Amii Stewart</a>. It is announced that Sasha Colby is the winner, leaving Anetra as the runner-up."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.154Z",
      "quote": "They lip-sync to \"Break My Soul\" by Beyoncé. After the lip-sync, Sapphira Cristál is announced as the winner of the challenge. RuPaul then announces that no one will be going home."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "They lip-sync to \"Shower\" by Becky G. After the lip-sync, Plane Jane is announced as the winner of the challenge. RuPaul then reveals that no one will be going home."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Geneva Karr and Hershii LiqCour-Jeté lip-sync to \"Maybe You're the Problem\" by Ava Max. Geneva Karr wins the lip-sync and Hershii LiqCour-Jeté is the first queen to sashay away."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Geneva Karr and Mirage lip-sync to \"Dark Lady\" by Cher. Geneva Karr wins the lip-sync and Mirage sashays away."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "They lip-sync to \"Emergency\" by Icona Pop. Q wins the lip-sync and Amanda Tori Meating sashays away."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Geneva Karr and Mhi'ya Iman Le'Paige lip-sync to \"Control\" by Janet Jackson. Mhi'ya Iman Le'Paige wins the lip-sync and Geneva Karr sashays away."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Megami and Mhi'ya Iman Le'Paige lip-sync to \"Flowers\" by Miley Cyrus. Mhi'ya Iman Le'Paige wins the lip-sync and Megami sashays away."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Morphine Love Dion and Xunami Muse lip-sync to \"I Wanna Dance With Somebody\" by Whitney Houston. Morphine Love Dion wins the lip-sync and Xunami Muse sashays away."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Mhi'ya Iman Le'Paige and Plasma lip-sync to \"Bloody Mary (Wednesday Dance TikTok Version)\" by Lady Gaga. Mhi'ya Iman Le'Paige wins the lip-sync and Plasma sashays away."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "They lip-sync to \"Made You Look\" by Meghan Trainor. After the lip-sync, Sapphira Cristál is announced as the winner of the challenge. RuPaul then announces that no one is going home."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Mhi'ya Iman Le'Paige and Morphine Love Dion lip-sync to \"Dim All the Lights\" by Donna Summer. Morphine Love Dion wins the lip-sync and Mhi'ya Iman Le'Paige sashays away."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Dawn and Morphine Love Dion lip-sync to \"Body\" by Megan Thee Stallion. Morphine Love Dion wins the lip-sync and Dawn sashays away."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "They lip-sync to \"Miss Me More\" by Kelsea Ballerini. Sapphira Cristál wins the lip-sync and Morphine Love Dion sashays away."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "They lip-sync to \"Better Be Good to Me\" by Tina Turner. Plane Jane wins the lip-sync and Q sashays away."
    }
  },
  {
    "id": "s16-e15-lala-r1-1",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Amanda Tori Meating then chooses \"Damaged\" by Danity Kane. Amanda Tori Meating wins the lip-sync and Dawn loses."
    }
  },
  {
    "id": "s16-e15-lala-r2-1",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R2",
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Megami then chooses \"The Shoop Shoop Song\" by Cher. Megami wins the lip-sync and Amanda Tori Meating loses."
    }
  },
  {
    "id": "s16-e15-lala-r1-2",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Megami then chooses \"What About\" by Janet Jackson. Megami wins the lip-sync and Q loses."
    }
  },
  {
    "id": "s16-e15-lala-r2-2",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R2",
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "The final two queens, Mirage and Morphine Love Dion, lip-sync to \"This Time I Know It's for Real\" by Donna Summer. Morphine Love Dion wins the lip-sync and Mirage loses."
    }
  },
  {
    "id": "s16-e15-lala-r1-3",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Geneva Karr then chooses \"Million Dollar Baby\" by Ava Max. Morphine Love Dion wins the lip-sync and Geneva Karr loses."
    }
  },
  {
    "id": "s16-e15-lala-r2-3",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R2",
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Megami and Mhi'ya Iman Le'Paige lip-sync to \"We Got the Beat\" by The Go-Go's. Megami wins the lip-sync and Mhi'ya Iman Le'Paige loses."
    }
  },
  {
    "id": "s16-e15-lala-r1-4",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "Hershii LiqCour-Jeté then chooses \"Alone 2.0\" by Kim Petras and Nicki Minaj. Mirage wins the lip-sync and Hershii LiqCour-Jeté loses."
    }
  },
  {
    "id": "s16-e15-lala-r1-5",
    "seasonId": "s16",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "The final three queens, Mhi'ya Iman Le'Paige, Plasma and Xunami Muse, lip-sync to \"Milkshake\" by Kelis. Mhi'ya Iman Le'Paige wins the lip-sync and Plasma and Xunami Muse lose."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.155Z",
      "quote": "In the final round, Megami and Morphine Love Dion lip-sync to \"Gonna Make You Sweat (Everybody Dance Now)\" by C+C Music Factory. Morphine Love Dion wins the lip-sync and earns the title of \"Queen of She Done Already Done Had Herses\"."
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
      "sha256": "2732530ba50f2c035ea8a168094645b27709947c77af5913a02866224c9dc545",
      "fetchedAt": "2026-04-22T20:23:55.156Z",
      "quote": "Nymphia Wind and Sapphira Cristál lip-sync to \"Padam Padam\" by Kylie Minogue. It is announced that Nymphia Wind is the winner, leaving Sapphira Cristál as the runner-up."
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.156Z",
      "quote": "Jewels Sparkles and Suzie Toot lip-sync to \"Woman's World\" by Katy Perry. After the lip-sync, Suzie Toot is announced as the winner of the challenge."
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.156Z",
      "quote": "Crystal Envy and Lexi Love are the top two queens of the week, and will lip-sync for the win. They then lip-sync to \"Alter Ego\" by Doechii and JT. After the lip-sync, Lexi Love is announced as the winner of the challenge."
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.156Z",
      "quote": "Hormona Lisa was rated lowest and will be lip-syncing for her life against Acacia Forgot, who was ranked the lowest in the previous episode. They then lip-sync to \"Yes, And\" by Ariana Grande. Acacia Forgot wins the lip-sync, but RuPaul reveals a new twist called \"Badonka Dunk\""
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.156Z",
      "quote": "Joella and Lucky Starzzz lip-sync to \"(It's Just) The Way That You Love Me\" by Paula Abdul. Joella wins the lip-sync. Lucky Starzzz pulls the 3rd lever of the \"Badonka Dunk\", failing to dunk Michelle into the water and sashays away."
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.156Z",
      "quote": "Joella and Kori King lip-sync to \"Buttons\" by the Pussycat Dolls featuring Snoop Dogg. Kori King wins the lip-sync. Joella pulls the 6th lever of the \"Badonka Dunk\", failing to dunk Michelle into the water and sashays away."
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.156Z",
      "quote": "Hormona Lisa and Lana Ja’Rae lip sync to \"Get Him Back!\" by Olivia Rodrigo. Lana Ja’Rae wins the lip sync and Hormona Lisa sashays away."
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.156Z",
      "quote": "Crystal Envy and Lana Ja’Rae lip sync to \"Hands to Myself\" by Selena Gomez. Lana Ja’Rae wins the lip sync and Crystal Envy sashays away."
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.156Z",
      "quote": "They lip-sync to \"Wet Dream\" by Adam Lambert. Kori King wins the lip sync and Acacia Forgot sashays away."
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.156Z",
      "quote": "Kori King and Lydia B Kollins lip sync to \"Kiss Me Deadly\" by Lita Ford. Lydia B Kollins wins the lip sync and Kori King sashays away."
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.156Z",
      "quote": "Arrietty and Jewels Sparkles lip sync to \"Ya Ya\" by Beyoncé. Jewels Sparkles wins the lip sync and Arrietty sashays away."
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
    "id": "s17-e15-lala-r1-1",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "In the first round, Hormona Lisa gets picked first and chooses to pick the song, selecting \"Say Liza (Liza with a Z)\" by Liza Minnelli. Lydia B. Kollins is chosen as her opponent. Lydia B. Kollins wins the lip-sync and Hormona Lisa loses."
    }
  },
  {
    "id": "s17-e15-lala-r2-1",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R2",
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "In the second round, Lucky Starzzz is picked first and chooses to pick the song, selecting \"We Found Love\" by Rihanna. Suzie Toot is chosen as her opponent. Suzie Toot wins the lip-sync and Lucky Starzzz loses."
    }
  },
  {
    "id": "s17-e15-lala-r1-2",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "Suzie Toot is next to be picked and chooses Joella to lip-sync against. Joella then selects \"Training Season\" by Dua Lipa. Suzie Toot wins the lip-sync and Joella loses."
    }
  },
  {
    "id": "s17-e15-lala-r2-2",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R2",
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "The final three queens, Lana Ja’Rae, Lydia B. Kollins and Kori King, lip-sync to \"360\" by Charli XCX. Kori King wins the lip-sync and Lana Ja’Rae and Lydia B. Kollins lose."
    }
  },
  {
    "id": "s17-e15-lala-r1-3",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "Lucky Starzzz is next to be picked and chooses to pick the song, selecting \"Step By Step (Junior Vasquez Tribal X Beats)\" by Whitney Houston. Lucky Starzzz wins the lip-sync and Acacia Forgot loses."
    }
  },
  {
    "id": "s17-e15-lala-r1-4",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "Arrietty gets picked next and chooses to pick the song, selecting “Blow Me (One Last Kiss)” by P!nk. Kori King is chosen as her opponent. Kori King wins the lip-sync and Arrietty loses."
    }
  },
  {
    "id": "s17-e15-lala-r1-5",
    "seasonId": "s17",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "The final two queens, Lana Ja’Rae and Crystal Envy, lip-sync to \"You Make Me Feel (Mighty Real)\" by Sylvester. Lana Ja’Rae wins the lip-sync and Crystal Envy loses."
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
      "sha256": "d0cd60491135e63ee807b102e2e07b6a3f951ed9ce9e6383fc99ff2b4ca7439a",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "In the final round, Suzie Toot and Kori King lip-sync to \"APT.\" by Rosé and Bruno Mars. Suzie Toot wins the lip-sync and earns the title of \"Queen of She Done Already Done Had Herses\"."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "Nini Coco and Vita VonTesse Starr lip-synced to \"Enough (Miami)\" by Cardi B. After the lip-sync, Nini Coco is announced as the winner of the challenge."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "DD Fuego and Mandy Mango lip-sync to \"Too Much\" by Dove Cameron. Mandy Mango wins the lip-sync and DD Fuego is the first queen to sashay away."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "Briar Blush and Mandy Mango lipsync to \"Love in Real Life\" by Lizzo. Briar Blush wins the lipsync and Mandy Mango sashays away."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "Briar Blush and Kenya Pleaser lipsync to \"Lights Camera Action\" by Kylie Minogue. Kenya Pleaser wins the lipsync and Briar Blush sashays away."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "Juicy Love Dion and Mia Starr lipsync to \"Pretty Ugly\" by Zara Larsson. After an outstanding lip sync RuPaul declares that it's a tie, with both Juicy Love Dion and Mia Starr winning the challenge."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "They lipsync for the win to \"Jerkin'\" by Amyl and the Sniffers. Athena Dion wins the lipsync and thus the challenge."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "Ciara Myst and Myki Meeks lipsync to \"Toxic\" by Britney Spears. Myki Meeks wins the lipsync and Ciara Myst sashays away."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "Juicy Love Dion and Vita VonTesse Starr lipsync to \"Houdini\" by Dua Lipa. Juicy Love Dion wins the lipsync and Vita VonTesse Starr sashays away."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "Kenya Pleaser and Mia Starr lipsync to \"Head Over Heels\" by The Go-Go's. Kenya Pleaser wins the lipsync and Mia Starr sashays away."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.157Z",
      "quote": "Athena Dion and Juicy Love Dion lipsync to \"Call Me When You Break Up\" by Selena Gomez, Benny Blanco and Gracie Abrams. Juicy Love Dion wins the lipsync and Athena Dion sashays away."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Jane Don't and Kenya Pleaser lipsync to \"Feels Like Another One\" by Patti LaBelle. Jane Don't wins the lipsync and thus the challenge."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Juicy Love Dion and Kenya Pleaser lipsync to \"Total Eclipse of the Heart\" by Bonnie Tyler. Juicy Love Dion wins the lipsync and Kenya Pleaser sashays away."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Discord Addams and Nini Coco lipsync to \"We Can't Be Friends (Wait for Your Love)\" by Ariana Grande. Nini Coco wins the lipsync and Discord Addams sashays away."
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "They lipsync to \"Garden of Eden\" by Lady Gaga. Nini Coco wins the lipsync and Jane Don't sashays away."
    }
  },
  {
    "id": "s18-e14-1",
    "seasonId": "s18",
    "episode": 14,
    "sequence": 1,
    "type": "regular",
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Juicy Love Dion and Nini Coco lipsync to \"Super Graphic Ultra Modern Girl\" by Chappell Roan. Nini Coco wins the lipsync and Juicy Love Dion sashays away."
    }
  },
  {
    "id": "s18-e15-lala-r1-1",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
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
    "id": "s18-e15-lala-r2-1",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R2",
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
    "id": "s18-e15-lala-r1-2",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
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
    "id": "s18-e15-lala-r2-2",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R2",
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
    "id": "s18-e15-lala-r1-3",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
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
    "id": "s18-e15-lala-semi-1",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "Semi",
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
    "id": "s18-e15-lala-r1-4",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
    "sequence": 4,
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
    "id": "s18-e15-lala-semi-2",
    "seasonId": "s18",
    "episode": 15,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "Semi",
    "sequence": 2,
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "<li><span style=\"color:#4169E1\"><b>Challenge Winner</b>: Juicy Love Dion</span></li>"
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
      "sha256": "29bb61fd7c44506a868cb25cc9ff1746d27110362b5afbf9a94ed35f94f0d993",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Myki Meeks and Nini Coco lip-sync to \"Every Girl You've Ever Loved\" by Miley Cyrus featuring Naomi Campbell. It is announced that Myki Meeks is the winner, leaving Nini Coco as the runner-up."
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
      "sha256": "b400b1b5b64a8f28dd794d19a9eaf701a253328dd32ebf4e939565ce002ab1d9",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Chad Michaels and Mimi Imfurst lip-sync for their pairs and they lip-sync to \"Opposites Attract\" by Paula Abdul. Chad Michaels wins the lip-sync, with Mimi Imfurst losing the lip-sync, meaning her and Pandora Boxx sashay away."
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
      "sha256": "b400b1b5b64a8f28dd794d19a9eaf701a253328dd32ebf4e939565ce002ab1d9",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Latrice Royale and Tammie Brown lip-sync for their pairs and they lip-sync to \"There's No Business Like Show Business\" by Ethel Merman. Latrice Royale wins the lip-sync, with Tammie Brown losing the lip-sync, meaning her and Nina Flowers sashay away."
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
      "sha256": "b400b1b5b64a8f28dd794d19a9eaf701a253328dd32ebf4e939565ce002ab1d9",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Jujubee and Manila Luzon lip-sync for their pairs and they lip-sync to \"Nasty\" by Janet Jackson. Jujubee wins the lip-sync, with Manila Luzon losing the lip-sync, meaning her and Latrice Royale sashay away."
    }
  },
  {
    "id": "as01-e04-1",
    "seasonId": "as01",
    "episode": 4,
    "sequence": 1,
    "type": "regular",
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
          "alexis_mateo"
        ]
      }
    ],
    "notes": "Yara meltdown, tag-in chaos [Wiki: Yara tagged in mid-LS]",
    "verified": true,
    "flags": [
      "corrected_from_wiki"
    ],
    "verification": {
      "url": "https://en.wikipedia.org/wiki/RuPaul%27s_Drag_Race_All_Stars_season_1",
      "sha256": "b400b1b5b64a8f28dd794d19a9eaf701a253328dd32ebf4e939565ce002ab1d9",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Raven and Alexis Mateo lip-sync for their pairs and they lip-sync to \"Don't Cha\" by The Pussycat Dolls. During the lip-sync, Yara Sofia pushes the \"she-mergency\" button and she finished the lip-sync for Alexis Mateo. Raven wins the lip-sync, meaning Alexis Mateo and Yara Sofia sashay away."
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
      "sha256": "b400b1b5b64a8f28dd794d19a9eaf701a253328dd32ebf4e939565ce002ab1d9",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Team Rujubee is the bottom team, with both of them lip-syncing to \"Dancing on My Own\" by Robyn. After an emotional performance, RuPaul announces that no one is going home."
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
      "title": "Responsitrannity (Matt's Pop Edit)",
      "artist": "RuPaul",
      "raw": "\"Responsitrannity (Matt's Pop Edit)\" — RuPaul"
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
      "sha256": "b400b1b5b64a8f28dd794d19a9eaf701a253328dd32ebf4e939565ce002ab1d9",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "The final two, Chad Michaels and Raven, lip-sync one last time to \"Responsitrannity (Matt's Pop Edit)\" by RuPaul. RuPaul then announces that Chad Michaels is the winner, leaving Raven as the runner-up."
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
      "sha256": "16be216d6ffbec77baaa16e30948f2f6e61f52a2244a69778e36bebea54b1568",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Roxxxy Andrews and Tatianna lip-sync to \"Shake It Off\" by Taylor Swift. Roxxxy Andrews wins the lip-sync and decides to eliminate Coco Montrese from the competition."
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
      "sha256": "16be216d6ffbec77baaa16e30948f2f6e61f52a2244a69778e36bebea54b1568",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Alaska and Katya lip-sync to \"Le Freak\" by Chic. Alaska wins the lip-sync and decides to eliminate Tatianna from the competition."
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
      "sha256": "16be216d6ffbec77baaa16e30948f2f6e61f52a2244a69778e36bebea54b1568",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Alyssa Edwards and Detox lip-sync to \"Tell It To My Heart\" by Taylor Dayne. Alyssa Edwards wins the lip-sync and decides to eliminate Ginger Minj from the competition."
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
      "sha256": "16be216d6ffbec77baaa16e30948f2f6e61f52a2244a69778e36bebea54b1568",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Alaska and Phi Phi O'Hara lip-sync to \"Got to Be Real\" by Cheryl Lynn. Alaska wins the lip-sync and decides to eliminate Alyssa Edwards from the competition."
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
      "sha256": "16be216d6ffbec77baaa16e30948f2f6e61f52a2244a69778e36bebea54b1568",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Alyssa Edwards and Tatianna lip-sync to \"Shut Up and Drive\" by Rihanna. Alyssa Edwards and Tatianna win the lip-sync and officially return to the competition. Alyssa Edwards and Tatianna both decide to eliminate Phi Phi O'Hara from the competition."
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
      "sha256": "16be216d6ffbec77baaa16e30948f2f6e61f52a2244a69778e36bebea54b1568",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Alaska and Katya lip-sync to \"Cherry Bomb\" by Joan Jett & The Blackhearts. Alaska wins the lip-sync and decides to eliminate Tatianna from the competition."
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
      "sha256": "16be216d6ffbec77baaa16e30948f2f6e61f52a2244a69778e36bebea54b1568",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "Detox and Katya lip-sync to \"Step It Up\" by RuPaul. Detox wins the lip-sync and decides to eliminate Alyssa Edwards from the competition."
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
      "sha256": "16be216d6ffbec77baaa16e30948f2f6e61f52a2244a69778e36bebea54b1568",
      "fetchedAt": "2026-04-22T20:23:55.158Z",
      "quote": "On the runway, Roxxxy Andrews is eliminated, leaving Alaska, Detox and Katya as the top three queens of the season. They lip-sync to \"If I Were Your Woman\" by Gladys Knight & the Pips. It is revealed that Alaska is the winner, leaving Detox and Katya as the runners-up."
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
      "sha256": "5f43ca5dd62a447b0d357e77d0e2bed8c1ecf9284ac4db1b3d69c48c514982f1",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Aja and BenDeLaCreme lip-sync to \"Anaconda\" by Nicki Minaj. BenDeLaCreme wins the lip-sync and decides to eliminate Morgan McMichaels from the competition."
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
      "sha256": "5f43ca5dd62a447b0d357e77d0e2bed8c1ecf9284ac4db1b3d69c48c514982f1",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "BenDeLaCreme and Shangela lip-sync to \"Jump (For My Love)\" by The Pointer Sisters. Shangela wins the lip-sync and decides to eliminate Thorgy Thor from the competition."
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
      "sha256": "5f43ca5dd62a447b0d357e77d0e2bed8c1ecf9284ac4db1b3d69c48c514982f1",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "BenDeLaCreme and Kennedy Davenport lip-sync to \"Green Light\" by Lorde. Kennedy Davenport wins the lip-sync and decides to eliminate Milk from the competition."
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
      "sha256": "5f43ca5dd62a447b0d357e77d0e2bed8c1ecf9284ac4db1b3d69c48c514982f1",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "BenDeLaCreme and Shangela lip-sync to \"I Kissed a Girl\" by Katy Perry. BenDeLaCreme and Shangela win the lip-sync and both decide to eliminate Chi Chi DeVayne from the competition."
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
      "sha256": "5f43ca5dd62a447b0d357e77d0e2bed8c1ecf9284ac4db1b3d69c48c514982f1",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "BeBe Zahara Benet and Trixie Mattel lip-sync to \"The Boss\" by Diana Ross. BeBe Zahara Benet wins the lip-sync and decides to eliminate Aja from the competition."
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
      "sha256": "5f43ca5dd62a447b0d357e77d0e2bed8c1ecf9284ac4db1b3d69c48c514982f1",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "BeBe Zahara Benet and BenDeLaCreme lip-sync to \"Nobody's Supposed to Be Here (Hex Hector Dance Mix)\" by Deborah Cox. BenDeLaCreme wins the lip-sync. She chooses Morgan McMichaels to return to the competition and then chooses to eliminate herself from the competition."
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
      "sha256": "5f43ca5dd62a447b0d357e77d0e2bed8c1ecf9284ac4db1b3d69c48c514982f1",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Shangela and Trixie Mattel lip-sync to \"Freaky Money\" by RuPaul ft. Big Freedia. Shangela wins the lip-sync and decides to eliminate Morgan McMichaels from the competition."
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
      "sha256": "5f43ca5dd62a447b0d357e77d0e2bed8c1ecf9284ac4db1b3d69c48c514982f1",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "BeBe Zahara Benet and Shangela receive the fewest votes, and are subsequently eliminated, leaving Kennedy Davenport and Trixie Mattel as the top two queens of the season. They lip-sync to \"Wrecking Ball\" by Miley Cyrus. It is revealed that Trixie Mattel is the winner, leaving Kennedy Davenport as the runner-up."
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
      "sha256": "f2706f66cff8bbdf42b79fe4442a3e5018faa1d54387ec853585107684bac589",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Monique Heart<br />(Jasmine)\n</td>\n<td>vs.\n</td>\n<td>Trinity the Tuck<br />(Jasmine)\n</td>\n<td>\"<a href=\"/wiki/Emotions_(Mariah_Carey_song)\" title=\"Emotions (Mariah Carey song)\">Emotions</a>\"<br />(<a href=\"/wiki/Mariah_Carey\" title=\"Mariah Carey\">Mariah Carey</a>)\n</td>\n<td><b>Trinity the Tuck</b>\n</td>\n<td>Farrah, Jasmine\n</td>\n<td bgcolor=\"lightblue\" nowrap=\"\"><b>Jasmine Masters</b>"
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
      "sha256": "f2706f66cff8bbdf42b79fe4442a3e5018faa1d54387ec853585107684bac589",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Monét X Change<br />(Farrah)\n</td>\n<td>vs.\n</td>\n<td>Valentina<br />(Farrah)\n</td>\n<td>\"<a href=\"/wiki/Into_You_(Ariana_Grande_song)\" title=\"Into You (Ariana Grande song)\">Into You</a>\"<br />(<a href=\"/wiki/Ariana_Grande\" title=\"Ariana Grande\">Ariana Grande</a>)\n</td>\n<td><b>Valentina</b>\n</td>\n<td>Farrah, Monique\n</td>\n<td bgcolor=\"lightgreen\"><b>Farrah Moan</b>"
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
      "sha256": "f2706f66cff8bbdf42b79fe4442a3e5018faa1d54387ec853585107684bac589",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Manila Luzon<br />(Gia)\n</td>\n<td>vs.\n</td>\n<td>Trinity the Tuck<br />(Gia)\n</td>\n<td>\"<a href=\"/wiki/How_Will_I_Know\" title=\"How Will I Know\">How Will I Know</a>\"<br />(<a href=\"/wiki/Whitney_Houston\" title=\"Whitney Houston\">Whitney Houston</a>)\n</td>\n<td><b>Manila Luzon</b>\n</td>\n<td>Gia, Valentina\n</td>\n<td bgcolor=\"lightblue\"><b>Gia Gunn</b>"
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
      "sha256": "f2706f66cff8bbdf42b79fe4442a3e5018faa1d54387ec853585107684bac589",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Manila Luzon<br />(Monét)\n</td>\n<td>vs.\n</td>\n<td>Monique Heart<br />(Latrice)\n</td>\n<td>\"<a href=\"/wiki/The_Bitch_Is_Back#Covers\" title=\"The Bitch Is Back\">The Bitch Is Back</a>\"<br />(<a href=\"/wiki/Tina_Turner\" title=\"Tina Turner\">Tina Turner</a>)\n</td>\n<td><b>Monique Heart</b>\n</td>\n<td>Latrice, Monét\n</td>\n<td bgcolor=\"lightblue\"><b>Latrice Royale</b>"
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
    "id": "as04-e06-lala-r4-1",
    "seasonId": "as04",
    "episode": 6,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R4",
    "sequence": 1,
    "type": "lalaparuza",
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
      "sha256": "f2706f66cff8bbdf42b79fe4442a3e5018faa1d54387ec853585107684bac589",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Latrice Royale\n</td>\n<td rowspan=\"2\">vs.\n</td>\n<td rowspan=\"2\">Monique Heart\n</td>\n<td rowspan=\"2\">\"Sissy That Walk\"<br />(RuPaul)\n</td>\n<td bgcolor=\"fuchsia\" colspan=\"3\"><b>Latrice Royale</b>\n</td></tr>\n<tr>\n<td bgcolor=\"violet\" colspan=\"3\"><b>Monique Heart</b>"
    }
  },
  {
    "id": "as04-e06-lala-r1-1",
    "seasonId": "as04",
    "episode": 6,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "f2706f66cff8bbdf42b79fe4442a3e5018faa1d54387ec853585107684bac589",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Jasmine Masters\n</td>\n<td>vs.\n</td>\n<td>Trinity the Tuck\n</td>\n<td>\"Peanut Butter\"<br />(<a href=\"/wiki/RuPaul\" title=\"RuPaul\">RuPaul</a> ft. <a href=\"/wiki/Big_Freedia\" title=\"Big Freedia\">Big Freedia</a>)\n</td>\n<td bgcolor=\"violet\" colspan=\"3\"><b>Trinity the Tuck</b>"
    }
  },
  {
    "id": "as04-e06-lala-r2-1",
    "seasonId": "as04",
    "episode": 6,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "f2706f66cff8bbdf42b79fe4442a3e5018faa1d54387ec853585107684bac589",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Farrah Moan\n</td>\n<td>vs.\n</td>\n<td>Valentina\n</td>\n<td>\"Kitty Girl\"<br />(RuPaul)\n</td>\n<td bgcolor=\"violet\" colspan=\"3\"><b>Valentina</b>"
    }
  },
  {
    "id": "as04-e06-lala-r3-1",
    "seasonId": "as04",
    "episode": 6,
    "bracket": "LaLaPaRuZa Smackdown",
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
      "sha256": "f2706f66cff8bbdf42b79fe4442a3e5018faa1d54387ec853585107684bac589",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Gia Gunn\n</td>\n<td>vs.\n</td>\n<td>Naomi Smalls\n</td>\n<td>\"Adrenaline\"<br />(RuPaul ft. Myah Marie)\n</td>\n<td bgcolor=\"violet\" colspan=\"3\"><b>Naomi Smalls</b>"
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
      "sha256": "f2706f66cff8bbdf42b79fe4442a3e5018faa1d54387ec853585107684bac589",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Latrice Royale<br />(Valentina)\n</td>\n<td>vs.\n</td>\n<td>Trinity the Tuck<br />(Valentina)\n</td>\n<td nowrap=\"\">\"<a href=\"/wiki/You_Spin_Me_Round_(Like_a_Record)\" title=\"You Spin Me Round (Like a Record)\">You Spin Me Round (Like a Record)</a>\"<br />(<a href=\"/wiki/Dead_or_Alive_(band)\" title=\"Dead or Alive (band)\">Dead or Alive</a>)\n</td>\n<td><b>Latrice Royale</b>\n</td>\n<td>Naomi, Valentina\n</td>\n<td bgcolor=\"lightpink\"><b>Valentina</b>"
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
      "sha256": "f2706f66cff8bbdf42b79fe4442a3e5018faa1d54387ec853585107684bac589",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Monét X Change<br />(Manila)\n</td>\n<td>vs.\n</td>\n<td>Naomi Smalls<br />(Manila)\n</td>\n<td>\"<a href=\"/wiki/Come_Rain_or_Come_Shine#Other_recordings\" title=\"Come Rain or Come Shine\">Come Rain or Come Shine</a>\"<br />(<a href=\"/wiki/Judy_Garland\" title=\"Judy Garland\">Judy Garland</a>)\n</td>\n<td><b>Naomi Smalls</b>\n</td>\n<td>Latrice, Manila\n</td>\n<td bgcolor=\"lightblue\"><b>Manila Luzon</b>"
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
      "sha256": "f2706f66cff8bbdf42b79fe4442a3e5018faa1d54387ec853585107684bac589",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Monique Heart<br />(Latrice)\n</td>\n<td>vs.\n</td>\n<td>Trinity the Tuck<br />(Latrice)\n</td>\n<td>\"<a href=\"/wiki/When_I_Think_of_You\" title=\"When I Think of You\">When I Think of You</a>\"<br />(<a href=\"/wiki/Janet_Jackson\" title=\"Janet Jackson\">Janet Jackson</a>)\n</td>\n<td><b>Trinity the Tuck</b>\n</td>\n<td>Latrice, Monét, Naomi\n</td>\n<td bgcolor=\"lightpink\"><b>Latrice Royale</b>"
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
      "sha256": "f2706f66cff8bbdf42b79fe4442a3e5018faa1d54387ec853585107684bac589",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "On the runway, category is All Star Eleganza. Monique Heart and Naomi Smalls are eliminated, leaving Monét X Change and Trinity The Tuck as the top two queens of the season. They lip-sync to \"Fighter\" by Christina Aguilera. It is revealed that Monét X Change and Trinity The Tuck are both the winners."
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
      "sha256": "a99b459b10358aea671d0f52383eb007ff57982a7a9fb235d548b7d90cc389a2",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "India Ferrah and Yvie Oddly then lip-sync to \"Livin' la Vida Loca\" by Ricky Martin. Yvie Oddly wins the lip-sync and reveals that the group has voted to eliminate Derrick Barry from the competition."
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
      "sha256": "a99b459b10358aea671d0f52383eb007ff57982a7a9fb235d548b7d90cc389a2",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Shea Couleé and Alyssa Edwards then lip-sync to \"Neutron Dance\" by The Pointer Sisters. Shea Couleé wins the lip-sync and decides to eliminate Ongina from the competition."
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
      "sha256": "a99b459b10358aea671d0f52383eb007ff57982a7a9fb235d548b7d90cc389a2",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Jujubee and Monét X Change then lip-sync to \"Juice\" by Lizzo. Monét X Change wins the lip-sync and reveals that the group has voted to eliminate Mariah Paris Balenciaga from the competition."
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
      "sha256": "a99b459b10358aea671d0f52383eb007ff57982a7a9fb235d548b7d90cc389a2",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Miz Cracker and Morgan McMichaels lip-sync to \"Where Have You Been\" by Rihanna. Miz Cracker and Morgan McMichaels both win the lip-sync. It is announced that both Miz Cracker and the queens voted to eliminate Mayhem Miller from the competition."
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
      "sha256": "a99b459b10358aea671d0f52383eb007ff57982a7a9fb235d548b7d90cc389a2",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Shea Couleé and Vanessa Vanjie Mateo then lip-sync to \"Open Your Heart\" by Madonna. Shea Couleé wins the lip-sync and decides to eliminate India Ferrah from the competition."
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
      "sha256": "a99b459b10358aea671d0f52383eb007ff57982a7a9fb235d548b7d90cc389a2",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Miz Cracker and Roxxxy Andrews lip-sync to \"One Last Time\" by Ariana Grande. Roxxxy Andrews wins the lip-sync and reveals that the queens have voted to eliminate Alexis Mateo from the competition."
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
      "sha256": "a99b459b10358aea671d0f52383eb007ff57982a7a9fb235d548b7d90cc389a2",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Miz Cracker and Kennedy Davenport then lip-sync to \"Fancy\" by Reba McEntire. Miz Cracker wins the lip-sync and decides to eliminate Blair St. Clair from the competition."
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
      "sha256": "a99b459b10358aea671d0f52383eb007ff57982a7a9fb235d548b7d90cc389a2",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Jujubee vs. Miz Cracker vs. Shea Couleé"
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.159Z",
      "quote": "Yara Sofia<br />(Trinity)\n</td>\n<td>vs.\n</td>\n<td><a href=\"/wiki/Coco_Montrese\" title=\"Coco Montrese\">Coco Montrese</a><br />(Serena)\n</td>\n<td>\"<a href=\"/wiki/Uptown_Funk\" title=\"Uptown Funk\">Uptown Funk</a>\"<br />(<a href=\"/wiki/Mark_Ronson\" title=\"Mark Ronson\">Mark Ronson</a> ft. <a href=\"/wiki/Bruno_Mars\" title=\"Bruno Mars\">Bruno Mars</a>)\n</td>\n<td><b>Coco Montrese</b>\n</td>\n<td>Serena, Trinity\n</td>\n<td bgcolor=\"lightblue\"><b>Serena ChaCha</b>"
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Ra'Jah O'Hara<br />(Jiggly)\n</td>\n<td rowspan=\"2\">vs.\n</td>\n<td rowspan=\"2\"><a href=\"/wiki/Brooke_Lynn_Hytes\" title=\"Brooke Lynn Hytes\">Brooke Lynn Hytes</a><br />(Jiggly)\n</td>\n<td rowspan=\"2\">\"<a href=\"/wiki/Miss_You_Much\" title=\"Miss You Much\">Miss You Much</a>\"<br />(<a href=\"/wiki/Janet_Jackson\" title=\"Janet Jackson\">Janet Jackson</a>)\n</td>\n<td nowrap=\"\"><b>Brooke Lynn Hytes</b>\n</td>\n<td rowspan=\"2\">Jiggly, Yara\n</td>\n<td rowspan=\"2\" bgcolor=\"lightblue\"><b>Jiggly Caliente</b>\n</td></tr>\n<tr>\n<td><b>Ra'Jah O'Hara</b>"
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Trinity K. Bonet<br />(Silky)\n</td>\n<td>vs.\n</td>\n<td nowrap=\"\"><a href=\"/wiki/Laganja_Estranja\" title=\"Laganja Estranja\">Laganja Estranja</a><br />(Silky)\n</td>\n<td>\"<a href=\"/wiki/Physical_(Dua_Lipa_song)\" title=\"Physical (Dua Lipa song)\">Physical</a>\"<br />(<a href=\"/wiki/Dua_Lipa\" title=\"Dua Lipa\">Dua Lipa</a>)\n</td>\n<td><b>Laganja Estranja</b>\n</td>\n<td>A'keria, Ginger, Jan, Silky\n</td>\n<td bgcolor=\"lightblue\" nowrap=\"\"><b>Silky Nutmeg Ganache</b>"
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Jan<br />(A'keria)\n</td>\n<td>vs.\n</td>\n<td><a href=\"/wiki/Jessica_Wild\" title=\"Jessica Wild\">Jessica Wild</a><br />(Yara)\n</td>\n<td>\"<a href=\"/wiki/Womanizer_(song)\" title=\"Womanizer (song)\">Womanizer</a>\"<br />(<a href=\"/wiki/Britney_Spears\" title=\"Britney Spears\">Britney Spears</a>)\n</td>\n<td><b>Jessica Wild</b>\n</td>\n<td>A'keria, Yara\n</td>\n<td bgcolor=\"lightgreen\"><b>Yara Sofia</b>"
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Ginger Minj<br />(Scarlet)\n</td>\n<td>vs.\n</td>\n<td><a href=\"/wiki/Mayhem_Miller_(drag_queen)\" title=\"Mayhem Miller (drag queen)\">Mayhem Miller</a><br />(Jan, Scarlet)\n</td>\n<td>\"<a href=\"/wiki/Phone_(song)\" class=\"mw-redirect\" title=\"Phone (song)\">Phone</a>\"<br />(<a href=\"/wiki/Lizzo\" title=\"Lizzo\">Lizzo</a>)\n</td>\n<td><b>Ginger Minj</b>\n</td>\n<td>Jan, Kylie, Scarlet\n</td>\n<td bgcolor=\"lightblue\"><b>Scarlet Envy</b>"
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Kylie Sonique Love<br />(A'keria)\n</td>\n<td>vs.\n</td>\n<td><a href=\"/wiki/Manila_Luzon\" title=\"Manila Luzon\">Manila Luzon</a><br />(A'keria)\n</td>\n<td nowrap=\"\">\"<a href=\"/wiki/Dirrty\" title=\"Dirrty\">Dirrty</a>\"<br />(<a href=\"/wiki/Christina_Aguilera\" title=\"Christina Aguilera\">Christina Aguilera</a> ft. <a href=\"/wiki/Redman_(rapper)\" title=\"Redman (rapper)\">Redman</a>)\n</td>\n<td><b>Kylie Sonique Love</b>\n</td>\n<td>A'keria, Ra'Jah\n</td>\n<td bgcolor=\"lightpink\"><b>A'keria C. Davenport</b>"
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Trinity K. Bonet<br />(Jan)\n</td>\n<td>vs.\n</td>\n<td><a href=\"/wiki/Alexis_Mateo\" title=\"Alexis Mateo\">Alexis Mateo</a><br />(Jan, Pandora)\n</td>\n<td>\"<a href=\"/wiki/Dance_Again\" title=\"Dance Again\">Dance Again</a>\"<br />(<a href=\"/wiki/Jennifer_Lopez\" title=\"Jennifer Lopez\">Jennifer Lopez</a> ft. <a href=\"/wiki/Pitbull_(rapper)\" title=\"Pitbull (rapper)\">Pitbull</a>)\n</td>\n<td><b>Alexis Mateo</b>\n</td>\n<td>Jan, Pandora\n</td>\n<td bgcolor=\"lightpink\"><b>Jan</b>"
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Ginger Minj<br />(Pandora)\n</td>\n<td>vs.\n</td>\n<td><a href=\"/wiki/Heidi_N_Closet\" title=\"Heidi N Closet\">Heidi N Closet</a><br />(Pandora)\n</td>\n<td>\"<a href=\"/wiki/Sugar_Walls\" title=\"Sugar Walls\">Sugar Walls</a>\"<br />(<a href=\"/wiki/Sheena_Easton\" title=\"Sheena Easton\">Sheena Easton</a>)\n</td>\n<td><b>Ginger Minj</b>\n</td>\n<td>Pandora, Trinity\n</td>\n<td bgcolor=\"lightgreen\"><b>Pandora Boxx</b>"
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Ra'Jah O'Hara<br />(Eureka!)\n</td>\n<td>vs.\n</td>\n<td><a href=\"/wiki/Kameron_Michaels\" title=\"Kameron Michaels\">Kameron Michaels</a><br />(Eureka!)\n</td>\n<td>\"<a href=\"/wiki/Boom_Clap\" title=\"Boom Clap\">Boom Clap</a>\"<br />(<a href=\"/wiki/Charli_XCX\" title=\"Charli XCX\">Charli XCX</a>)\n</td>\n<td><b>Kameron Michaels</b>\n</td>\n<td nowrap=\"\">Eureka!, Ginger,<br />Kylie, Trinity\n</td>\n<td bgcolor=\"lightblue\"><b>Eureka!</b>"
    }
  },
  {
    "id": "as06-e10-rude-r2-1",
    "seasonId": "as06",
    "episode": 10,
    "bracket": "RuDemption Lip Sync Smackdown",
    "round": "R2",
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<td>Jiggly Caliente\n</td>\n<td>vs.\n</td>\n<td>Silky Nutmeg Ganache\n</td>\n<td>\"<a href=\"/wiki/Girls_Just_Want_to_Have_Fun\" title=\"Girls Just Want to Have Fun\">Girls Just Want to Have Fun</a>\"<br />(<a href=\"/wiki/Cyndi_Lauper\" title=\"Cyndi Lauper\">Cyndi Lauper</a>)\n</td>\n<td colspan=\"3\" bgcolor=\"violet\"><b>Silky Nutmeg Ganache</b>"
    }
  },
  {
    "id": "as06-e10-rude-r3-1",
    "seasonId": "as06",
    "episode": 10,
    "bracket": "RuDemption Lip Sync Smackdown",
    "round": "R3",
    "sequence": 1,
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<td nowrap=\"\">Silky Nutmeg Ganache\n</td>\n<td>vs.\n</td>\n<td>Yara Sofia\n</td>\n<td>\"<a href=\"/wiki/Point_of_No_Return_(Expos%C3%A9_song)\" title=\"Point of No Return (Exposé song)\">Point of No Return</a>\"<br />(<a href=\"/wiki/Expos%C3%A9_(group)\" title=\"Exposé (group)\">Exposé</a>)\n</td>\n<td colspan=\"3\" bgcolor=\"violet\"><b>Silky Nutmeg Ganache</b>"
    }
  },
  {
    "id": "as06-e10-rude-r4-1",
    "seasonId": "as06",
    "episode": 10,
    "bracket": "RuDemption Lip Sync Smackdown",
    "round": "R4",
    "sequence": 1,
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<td>Scarlet Envy\n</td>\n<td>vs.\n</td>\n<td>Silky Nutmeg Ganache\n</td>\n<td>\"<a href=\"/wiki/Song_for_the_Lonely\" title=\"Song for the Lonely\">Song for the Lonely</a>\"<br />(<a href=\"/wiki/Cher\" title=\"Cher\">Cher</a>)\n</td>\n<td colspan=\"3\" bgcolor=\"violet\"><b>Silky Nutmeg Ganache</b>"
    }
  },
  {
    "id": "as06-e10-rude-r5-1",
    "seasonId": "as06",
    "episode": 10,
    "bracket": "RuDemption Lip Sync Smackdown",
    "round": "R5",
    "sequence": 1,
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<td>Jan\n</td>\n<td>vs.\n</td>\n<td>Silky Nutmeg Ganache\n</td>\n<td>\"<a href=\"/wiki/Heartbreaker_(Pat_Benatar_song)\" title=\"Heartbreaker (Pat Benatar song)\">Heartbreaker</a>\"<br />(<a href=\"/wiki/Pat_Benatar\" title=\"Pat Benatar\">Pat Benatar</a>)\n</td>\n<td colspan=\"3\" bgcolor=\"violet\"><b>Silky Nutmeg Ganache</b>"
    }
  },
  {
    "id": "as06-e10-rude-r6-1",
    "seasonId": "as06",
    "episode": 10,
    "bracket": "RuDemption Lip Sync Smackdown",
    "round": "R6",
    "sequence": 1,
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<td>Pandora Boxx\n</td>\n<td>vs.\n</td>\n<td>Silky Nutmeg Ganache\n</td>\n<td>\"<a href=\"/wiki/Focus_(Ariana_Grande_song)\" title=\"Focus (Ariana Grande song)\">Focus</a>\"<br />(<a href=\"/wiki/Ariana_Grande\" title=\"Ariana Grande\">Ariana Grande</a>)\n</td>\n<td colspan=\"3\" bgcolor=\"violet\"><b>Silky Nutmeg Ganache</b>"
    }
  },
  {
    "id": "as06-e10-rude-final-1",
    "seasonId": "as06",
    "episode": 10,
    "bracket": "RuDemption Lip Sync Smackdown",
    "round": "Final",
    "sequence": 1,
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<td>Eureka!\n</td>\n<td>vs.\n</td>\n<td>Silky Nutmeg Ganache\n</td>\n<td>\"<a href=\"/wiki/Since_U_Been_Gone\" title=\"Since U Been Gone\">Since U Been Gone</a>\"<br />(<a href=\"/wiki/Kelly_Clarkson\" title=\"Kelly Clarkson\">Kelly Clarkson</a>)\n</td>\n<td colspan=\"3\" bgcolor=\"fuchsia\"><b>Eureka!</b>"
    }
  },
  {
    "id": "as06-e10-rude-r1-1",
    "seasonId": "as06",
    "episode": 10,
    "bracket": "RuDemption Lip Sync Smackdown",
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<td>Jiggly Caliente\n</td>\n<td>vs.\n</td>\n<td>Serena ChaCha\n</td>\n<td>\"<a href=\"/wiki/Free_Your_Mind_(song)\" title=\"Free Your Mind (song)\">Free Your Mind</a>\"<br />(<a href=\"/wiki/En_Vogue\" title=\"En Vogue\">En Vogue</a>)\n</td>\n<td colspan=\"3\" bgcolor=\"violet\"><b>Jiggly Caliente</b>"
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Eureka!<br />(Trinity)\n</td>\n<td rowspan=\"2\">vs.\n</td>\n<td rowspan=\"2\"><a href=\"/wiki/Jaida_Essence_Hall\" title=\"Jaida Essence Hall\">Jaida Essence Hall</a><br />(Trinity)\n</td>\n<td rowspan=\"2\">\"<a href=\"/wiki/Good_Golly,_Miss_Molly\" title=\"Good Golly, Miss Molly\">Good Golly, Miss Molly</a>\"<br />(<a href=\"/wiki/Little_Richard\" title=\"Little Richard\">Little Richard</a>)\n</td>\n<td><b>Eureka!</b>\n</td>\n<td rowspan=\"2\">Ginger, Kylie, Ra'Jah, Trinity\n</td>\n<td rowspan=\"2\" bgcolor=\"tomato\"><b>Trinity K. Bonet</b>"
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
      "sha256": "23ad8c19b510b694855224e9ede066e6eac4443e0617c78132719721132fe71f",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Eureka! vs. Ginger Minj vs. Kylie Sonique Love vs. Ra'Jah O'Hara\n</td>\n<td>\"<a href=\"/wiki/Stupid_Love_(Lady_Gaga_song)\" title=\"Stupid Love (Lady Gaga song)\">Stupid Love</a>\"<br />(<a href=\"/wiki/Lady_Gaga\" title=\"Lady Gaga\">Lady Gaga</a>)\n</td>\n<td bgcolor=\"#D4AF37\" colspan=\"3\"><b>Kylie Sonique Love</b>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<li><b>Lip Sync Song</b>: \"<a href=\"/wiki/Old_MacDonald_Had_a_Farm\" title=\"Old MacDonald Had a Farm\">Old MacDonald</a>\" by <a href=\"/wiki/Ella_Fitzgerald\" title=\"Ella Fitzgerald\">Ella Fitzgerald</a></li>\n<li><span style=\"color:royalblue\"><b>Lip Sync for Your Legacy Winner</b>: Shea Couleé</span></li>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<li><b>Lip Sync Song</b>: \"<a href=\"/wiki/Rumour_Has_It_(Adele_song)\" title=\"Rumour Has It (Adele song)\">Rumour Has It</a>\" by <a href=\"/wiki/Adele\" title=\"Adele\">Adele</a></li>\n<li><span style=\"color:royalblue\"><b>Lip Sync for Your Legacy Winner</b>: Jinkx Monsoon</span></li>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<li><b>Lip Sync Song</b>: \"<a href=\"/wiki/Green_Light_(Beyonc%C3%A9_song)\" title=\"Green Light (Beyoncé song)\">Green Light</a>\" by <a href=\"/wiki/Beyonc%C3%A9\" title=\"Beyoncé\">Beyoncé</a></li>\n<li><span style=\"color:royalblue\"><b>Lip Sync for Your Legacy Winner</b>: Jaida Essence Hall</span></li>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<li><b>Lip Sync Song</b>: \"<a href=\"/wiki/Love_Will_Save_The_Day\" class=\"mw-redirect\" title=\"Love Will Save The Day\">Love Will Save The Day</a> (Jellybean &amp; David Morales Remix)\" by <a href=\"/wiki/Whitney_Houston\" title=\"Whitney Houston\">Whitney Houston</a></li>\n<li><span style=\"color:royalblue\"><b>Lip Sync for Your Legacy Winner</b>: The Vivienne</span></li>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<li><b>Lip Sync Song</b>: \"<a href=\"/wiki/Cuz_I_Love_You\" title=\"Cuz I Love You\">Better In Color</a>\" by <a href=\"/wiki/Lizzo\" title=\"Lizzo\">Lizzo</a></li>\n<li><span style=\"color:royalblue\"><b>Lip Sync for Your Legacy Winner</b>: Jinkx Monsoon</span></li>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<li><b>Lip Sync Song</b>: \"<a href=\"/wiki/Why%27d_You_Come_in_Here_Lookin%27_Like_That\" title=\"Why&#39;d You Come in Here Lookin&#39; Like That\">Why'd You Come in Here Lookin' Like That</a>\" by <a href=\"/wiki/Dolly_Parton\" title=\"Dolly Parton\">Dolly Parton</a></li>\n<li><span style=\"color:royalblue\"><b>Lip Sync for Your Legacy Winner</b>: The Vivienne</span></li>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<li><b>Lip Sync Song</b>: \"I Want Love\" by <a href=\"/wiki/Jessie_J\" title=\"Jessie J\">Jessie J</a></li>\n<li><span style=\"color:royalblue\"><b>Lip Sync for Your Legacy Winner</b>: Trinity The Tuck</span></li>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<li><b>Lip Sync Song</b>: \"<a href=\"/wiki/Super_Freak\" title=\"Super Freak\">Super Freak</a>\" by <a href=\"/wiki/Rick_James\" title=\"Rick James\">Rick James</a></li>\n<li><span style=\"color:royalblue\"><b>Lip Sync for Your Legacy Winner</b>: Raja</span></li>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<li><b>Spoken Word Lip Sync</b>: \"The Night The Lights Went Out in Georgia\" Monologue from <a href=\"/wiki/Designing_Women\" title=\"Designing Women\">Designing Women</a> by <a href=\"/wiki/Dixie_Carter\" title=\"Dixie Carter\">Dixie Carter</a> as Julia Sugarbaker</li>\n<li><span style=\"color:royalblue\"><b>Lip Sync for Your Legacy Winner</b>: Monét X Change</span></li>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<li><b>Lip Sync Song</b>: \"<a href=\"/wiki/Kings_%26_Queens_(Ava_Max_song)\" title=\"Kings &amp; Queens (Ava Max song)\">Kings &amp; Queens</a>\" by <a href=\"/wiki/Ava_Max\" title=\"Ava Max\">Ava Max</a></li>\n<li><span style=\"color:royalblue\"><b>Lip Sync for Your Legacy Winner</b>: Jinkx Monsoon</span></li>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<li><b>Lip Sync Song</b>: \"<a href=\"/wiki/Disco_(Kylie_Minogue_album)#Track_listing\" title=\"Disco (Kylie Minogue album)\">Supernova</a>\" by <a href=\"/wiki/Kylie_Minogue\" title=\"Kylie Minogue\">Kylie Minogue</a></li>\n<li><span style=\"color:royalblue\"><b>Lip Sync for Your Legacy Winner</b>: Shea Couleé</span></li>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<td>The Vivienne\n</td>\n<td>vs.\n</td>\n<td>Yvie Oddly\n</td>\n<td>\"<a href=\"/wiki/Push_It_(Salt-n-Pepa_song)\" title=\"Push It (Salt-n-Pepa song)\">Push It</a>\"<br />(<a href=\"/wiki/Salt-N-Pepa\" title=\"Salt-N-Pepa\">Salt-N-Pepa</a>)\n</td>\n<td bgcolor=\"fuchsia\" colspan=\"2\"><b>Yvie Oddly</b>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<td>Jaida Essence Hall\n</td>\n<td>vs.\n</td>\n<td>Raja\n</td>\n<td>\"<a href=\"/wiki/Let%27s_Hear_It_for_the_Boy\" title=\"Let&#39;s Hear It for the Boy\">Let's Hear It for the Boy</a>\"<br />(<a href=\"/wiki/Deniece_Williams\" title=\"Deniece Williams\">Deniece Williams</a>)\n</td>\n<td bgcolor=\"fuchsia\" colspan=\"2\"><b>Raja</b>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<td>Raja\n</td>\n<td>vs.\n</td>\n<td>Yvie Oddly\n</td>\n<td>\"<a href=\"/wiki/Sisters_Are_Doin%27_It_for_Themselves\" title=\"Sisters Are Doin&#39; It for Themselves\">Sisters Are Doin' It for Themselves</a>\"<br />(<a href=\"/wiki/Eurythmics\" title=\"Eurythmics\">Eurythmics</a>, <a href=\"/wiki/Aretha_Franklin\" title=\"Aretha Franklin\">Aretha Franklin</a>)\n</td>\n<td bgcolor=\"#FFD700\" colspan=\"2\"><b>Raja</b>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<td>Jinkx Monsoon\n</td>\n<td>vs.\n</td>\n<td>Shea Couleé\n</td>\n<td>\"<a href=\"/wiki/Judas_(Lady_Gaga_song)\" title=\"Judas (Lady Gaga song)\">Judas</a>\"<br />(<a href=\"/wiki/Lady_Gaga\" title=\"Lady Gaga\">Lady Gaga</a>)\n</td>\n<td bgcolor=\"violet\" colspan=\"2\"><b>Jinkx Monsoon</b>"
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<td>Monét X Change\n</td>\n<td>vs.\n</td>\n<td>Trinity the Tuck\n</td>\n<td>\"<a href=\"/wiki/So_What_(Pink_song)\" title=\"So What (Pink song)\">So What</a>\"<br />(<a href=\"/wiki/Pink_(singer)\" title=\"Pink (singer)\">P!nk</a>)\n</td>\n<td bgcolor=\"violet\" colspan=\"2\"><b>Monét X Change</b>"
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
    "type": "lalaparuza",
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
      "sha256": "4be444377d5c852c88b7d41299cdcb7603caf70a272820791cfaa5359180a9a8",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "<td>Jinkx Monsoon\n</td>\n<td>vs.\n</td>\n<td>Monét X Change\n</td>\n<td>\"<a href=\"/wiki/Swish_Swish\" title=\"Swish Swish\">Swish Swish</a>\"<br />(<a href=\"/wiki/Katy_Perry\" title=\"Katy Perry\">Katy Perry</a> ft. <a href=\"/wiki/Nicki_Minaj\" title=\"Nicki Minaj\">Nicki Minaj</a>)\n</td>\n<td bgcolor=\"#D4AF37\" colspan=\"2\"><b>Jinkx Monsoon</b>"
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
      "sha256": "d838c9fa8231a61e49f71b7e1f712291fac322946eea7845336cd0f1ede67152",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Aja and Kahanna Montrese lip-sync to \"Freakum Dress\" by Beyoncé. Aja wins the lip-sync and reveals that the group has chosen to eliminate Monica Beverly Hillz."
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
      "sha256": "d838c9fa8231a61e49f71b7e1f712291fac322946eea7845336cd0f1ede67152",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Jimbo and Pangina Heals lip-sync to \"She Bop\" by Cyndi Lauper. Pangina Heals wins the lip-sync and reveals that the group has chosen to eliminate Naysha Lopez."
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
      "sha256": "d838c9fa8231a61e49f71b7e1f712291fac322946eea7845336cd0f1ede67152",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Jessica and Ra'Jah lip-sync to \"Coconuts\" by Kim Petras. Jessica wins the lip-sync and eliminates Mrs. Kasha Davis from the competition."
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
      "sha256": "d838c9fa8231a61e49f71b7e1f712291fac322946eea7845336cd0f1ede67152",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Jimbo and Shannel lip-sync to \"Bad Reputation\" by Joan Jett. Shannel wins the lip-sync and reveals that the group has chosen to eliminate Darienne Lake."
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
      "sha256": "d838c9fa8231a61e49f71b7e1f712291fac322946eea7845336cd0f1ede67152",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Jasmine and Jimbo lip-sync to \"Hallucinate\" by Dua Lipa. Jasmine wins the lip sync. Because of Heidi N Closet's departure, neither of the bottom two is eliminated."
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
      "sha256": "d838c9fa8231a61e49f71b7e1f712291fac322946eea7845336cd0f1ede67152",
      "fetchedAt": "2026-04-22T20:23:55.160Z",
      "quote": "Angeria and Kandy lip-sync to \"I'm Not Perfect (But I'm Perfect for You)\" by Grace Jones. Kandy wins the lip sync and eliminates Jaymes Mansfield from the competition."
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
      "sha256": "d838c9fa8231a61e49f71b7e1f712291fac322946eea7845336cd0f1ede67152",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Jorgeous and LaLa lip-sync to \"About Damn Time\" by Lizzo. LaLa wins the lip sync and eliminates Kahanna Montrese from the competition."
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
      "sha256": "d838c9fa8231a61e49f71b7e1f712291fac322946eea7845336cd0f1ede67152",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Nicky and Alexis lip-sync to \"These Boots Are Made for Walkin'\" by Nancy Sinatra. Alexis wins the lip sync and eliminates LaLa Ri from the competition."
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
      "sha256": "d838c9fa8231a61e49f71b7e1f712291fac322946eea7845336cd0f1ede67152",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Jimbo and Silky lip-sync to \"Freak-A-Zoid\" by Midnight Star. Jimbo wins the lip sync and eliminates Alexis Michelle from the competition."
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
      "sha256": "d838c9fa8231a61e49f71b7e1f712291fac322946eea7845336cd0f1ede67152",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Kandy Muse<br />(Jessica)\n</td>\n<td>vs.\n</td>\n<td><a href=\"/wiki/Priyanka_(drag_queen)\" title=\"Priyanka (drag queen)\">Priyanka</a><br />(Jessica, Jimbo)\n</td>\n<td>\"<a href=\"/wiki/Jumpin%27,_Jumpin%27\" title=\"Jumpin&#39;, Jumpin&#39;\">Jumpin', Jumpin'</a>\"<br />(<a href=\"/wiki/Destiny%27s_Child\" title=\"Destiny&#39;s Child\">Destiny's Child</a>)\n</td>\n<td><b>Priyanka</b>\n</td>\n<td>Jessica, Jimbo\n</td>\n<td bgcolor=\"lightpink\"><b>Jessica Wild</b>"
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
      "sha256": "d838c9fa8231a61e49f71b7e1f712291fac322946eea7845336cd0f1ede67152",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "<th scope=\"row\" rowspan=\"2\">11<sup id=\"cite&#95;ref-episode11&#95;20-1\" class=\"reference\"><a href=\"#cite_note-episode11-20\"><span class=\"cite-bracket\">&#91;</span>16<span class=\"cite-bracket\">&#93;</span></a></sup>\n</th>\n<td rowspan=\"2\">Jaymes Mansfield\n</td>\n<td rowspan=\"2\">vs.\n</td>\n<td rowspan=\"2\">LaLa Ri\n</td>\n<td rowspan=\"2\">\"<a href=\"/wiki/Rain_on_Me_(Lady_Gaga_and_Ariana_Grande_song)\" title=\"Rain on Me (Lady Gaga and Ariana Grande song)\">Rain on Me</a>\"<br />(<a href=\"/wiki/Lady_Gaga\" title=\"Lady Gaga\">Lady Gaga</a>, <a href=\"/wiki/Ariana_Grande\" title=\"Ariana Grande\">Ariana Grande</a>)\n</td>\n<td colspan=\"3\" bgcolor=\"gold\"><b>Jaymes Mansfield</b>\n</td></tr>\n<tr>\n<td colspan=\"3\" bgcolor=\"gold\"><b>LaLa Ri</b>"
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
      "sha256": "d838c9fa8231a61e49f71b7e1f712291fac322946eea7845336cd0f1ede67152",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Jimbo and Kandy then lip-sync to \"Do Ya Wanna Funk\" by Sylvester and Patrick Cowley. After the lip-sync it is declared that Jimbo is the winner of the season, leaving Kandy Muse as runner-up."
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Angeria Paris VanMicheals and Jorgeous are the top 2 queens of the week. They lip-sync to \"Million Dollar Bill (Freemasons Radio Mix)\" by Whitney Houston. Angeria Paris VanMicheals wins the lip-sync"
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Gottmik and Plastique Tiara are the top 2 queens of the week. They lip-sync to \"Jump in the Line\" by Harry Belafonte. Gottmik wins the lip-sync"
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Gottmik and Nina West are the top 2 queens of the week. They lip-sync to \"Banana\" by Anitta ft. Becky G. Gottmik wins the lip-sync"
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Roxxxy Andrews and Vanessa Vanjie are declared the top 2 queens of the week. They lip-sync to \"Black Cat\" by Janet Jackson. Both queens win the lip-sync"
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Plastique Tiara and Roxxxy Andrews are declared the top 2 queens of the week. They lip-sync to \"Super Freaky Girl\" by Nicki Minaj. Roxxxy Andrews wins the lip-sync"
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Angeria Paris VanMicheals and Plastique Tiara are declared the top 2 queens of the week. They lip-sync to \"Be My Lover\" by La Bouche. Angeria Paris VanMicheals wins the lip-sync"
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Angeria Paris VanMicheals and Nina West are declared the top 2 queens of the week. They lip-sync to \"Lovergirl\" by Teena Marie. Angeria Paris VanMicheals wins the lip-sync"
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Plastique Tiara and Roxxxy Andrews are declared the top 2 queens of the week. They lip-sync to \"No One Gets the Prize\" by Diana Ross. Roxxxy Andrews wins the lip-sync"
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "Jorgeous and Shannel are declared the top 2 queens of the week. They lip-sync to \"Love Come Home (Subgroovers Music Video Edit)\" by Kristine W. Both queens win the lip-sync."
    }
  },
  {
    "id": "as09-e10-lala-r1-1",
    "seasonId": "as09",
    "episode": 10,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
    "sequence": 1,
    "type": "lalaparuza",
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "First, Gottmik chooses to lip-sync against Angeria Paris VanMicheals, who chooses \"My Lovin' (You're Never Gonna Get It)\" by En Vogue. Angeria Paris VanMicheals wins the lip-sync and advances to round 2."
    }
  },
  {
    "id": "as09-e10-lala-final-1",
    "seasonId": "as09",
    "episode": 10,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "Final",
    "sequence": 1,
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "In the final round Roxxxy Andrews and Shannel lip-sync to \"Break Free\" by Ariana Grande ft. Zedd. Roxxxy Andrews wins the lip-sync."
    }
  },
  {
    "id": "as09-e10-lala-r1-2",
    "seasonId": "as09",
    "episode": 10,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
    "sequence": 2,
    "type": "lalaparuza",
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "In the second lip-sync, Vanessa Vanjie chooses Plastique Tiara as her opponent, who chooses \"When I Grow Up\" by The Pussycat Dolls. Vanessa Vanjie wins and advances to round 2."
    }
  },
  {
    "id": "as09-e10-lala-r1-3",
    "seasonId": "as09",
    "episode": 10,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
    "sequence": 3,
    "type": "lalaparuza",
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "In the third lip-sync, Nina West chooses Shannel as her opponent, who chooses \"You Spin Me Round (Like a Record)\" by Dead or Alive. Shannel wins and advances to round 2."
    }
  },
  {
    "id": "as09-e10-lala-r1-4",
    "seasonId": "as09",
    "episode": 10,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R1",
    "sequence": 4,
    "type": "lalaparuza",
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "As the last two remaining queens, Jorgeous and Roxxxy Andrews must lip-sync. Roxxxy Andrews is randomly selected to pick the song and chooses \"Holding Out for a Hero\" by Bonnie Tyler. Roxxxy Andrews wins and advances to round 2."
    }
  },
  {
    "id": "as09-e10-lala-r2-1",
    "seasonId": "as09",
    "episode": 10,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R2",
    "sequence": 1,
    "type": "lalaparuza",
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "In the first lip-sync of round 2, Vanessa Vanjie chooses Shannel as her opponent, who chooses \"I'm Every Woman\" by Chaka Khan. Shannel wins and advances to the final round."
    }
  },
  {
    "id": "as09-e10-lala-r2-2",
    "seasonId": "as09",
    "episode": 10,
    "bracket": "LaLaPaRuZa Smackdown",
    "round": "R2",
    "sequence": 2,
    "type": "lalaparuza",
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
      "sha256": "2e0f5279b6cb4f69f6e6a23a83f1660d48da925e353a63f21ec7f6ae7a122745",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "In the second lip-sync of round 2, the two remaining queens, Angeria Paris VanMicheals and Roxxxy Andrews, must lip-sync. The remaining song is \"Groove Is in the Heart\" by Deee-Lite. Roxxxy Andrews wins and advances to the final round."
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
    "id": "as10-e01-b1-r1-1",
    "seasonId": "as10",
    "episode": 1,
    "bracket": "Bracket 1",
    "round": "R1",
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
      "sha256": "0113c91e98303c88bf2d871d91a0463df5ca74d76552b5a7007a16833c7735d0",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "naming Aja and Irene the Alien the Top 2 queens of the week. They lip-sync to \"Think U the Shit (Fart)\" by Ice Spice. Aja wins the lip-sync and receives the prize."
    }
  },
  {
    "id": "as10-e02-b1-r2-1",
    "seasonId": "as10",
    "episode": 2,
    "bracket": "Bracket 1",
    "round": "R2",
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
      "sha256": "0113c91e98303c88bf2d871d91a0463df5ca74d76552b5a7007a16833c7735d0",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "naming Bosco and Irene the Alien the Top 2 queens of the week. They lip-sync to \"Murder on the Dancefloor\" by Sophie Ellis-Bextor. Bosco wins the lip-sync and receives the prize."
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
    "id": "as10-e04-b2-r1-1",
    "seasonId": "as10",
    "episode": 4,
    "bracket": "Bracket 2",
    "round": "R1",
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
      "sha256": "0113c91e98303c88bf2d871d91a0463df5ca74d76552b5a7007a16833c7735d0",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "naming Lydia B Kollins and Tina Burner the Top 2 queens of the week. They lip-sync to Love Sensation by Loleatta Holloway. Lydia B Kollins wins the lip-sync and receives the prize."
    }
  },
  {
    "id": "as10-e05-b2-r2-1",
    "seasonId": "as10",
    "episode": 5,
    "bracket": "Bracket 2",
    "round": "R2",
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
      "sha256": "0113c91e98303c88bf2d871d91a0463df5ca74d76552b5a7007a16833c7735d0",
      "fetchedAt": "2026-04-22T20:23:55.161Z",
      "quote": "naming Jorgeous and Mistress Isabelle Brooks the Top 2 queens of the week. They lip-sync to \"Hot to Go!\" by Chappell Roan. Jorgeous and Mistress Isabelle Brooks win the lip-sync and each win $5,000 and half point."
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
    "id": "as10-e07-b3-r1-1",
    "seasonId": "as10",
    "episode": 7,
    "bracket": "Bracket 3",
    "round": "R1",
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
      "sha256": "0113c91e98303c88bf2d871d91a0463df5ca74d76552b5a7007a16833c7735d0",
      "fetchedAt": "2026-04-22T20:23:55.162Z",
      "quote": "name Daya Betty and Ginger Minj the winning pair and the Top 2 queens of the week. They lip-sync to Defying Gravity by the original Broadway cast of Wicked. Ginger Minj wins the lip-sync and receives $10,000 and an extra point."
    }
  },
  {
    "id": "as10-e08-b3-r2-1",
    "seasonId": "as10",
    "episode": 8,
    "bracket": "Bracket 3",
    "round": "R2",
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
      "sha256": "0113c91e98303c88bf2d871d91a0463df5ca74d76552b5a7007a16833c7735d0",
      "fetchedAt": "2026-04-22T20:23:55.162Z",
      "quote": "Denali and Ginger Minj are named the Top 2 queens of the week. They lip-sync to \"See You Again\" by Miley Cyrus. Ginger Minj wins the lip-sync, winning $10,000 and an additional point."
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
      "sha256": "0113c91e98303c88bf2d871d91a0463df5ca74d76552b5a7007a16833c7735d0",
      "fetchedAt": "2026-04-22T20:23:55.162Z",
      "quote": "Cynthia Lee Fontaine and Mistress Isabelle Brooks lip-sync to \"Who's Zoomin' Who\" (Acappella Mix) by Aretha Franklin. Mistress Isabelle Brooks wins the lip-sync and Cynthia Lee Fontaine sashays away."
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
