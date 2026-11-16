// Timeline for the How It Works reel. Filled from the captured screenshots
// (public/howitworks/shots/manifest.json) and the voiceover timings
// (public/howitworks/vo/script.json).

export interface Word { text: string; start_ms: number; end_ms: number }
export interface Beat {
  src: string;
  h: number; // image height in CSS px (390 wide)
  from: number; // ms from chapter start
  scrollFrom?: number;
  scrollTo?: number;
  zoom?: { x: number; y: number; scale: number };
  tap?: { x: number; y: number; at: number }; // at = ms from beat start
}
export interface ReelChapter {
  key: string;
  title: string;
  vo: string;
  durationMs: number;
  tailMs?: number; // pause after the voice line (short cut tunes this to hit 15s)
  words: Word[];
  beats: Beat[]; // empty = brand card (intro / outro)
}

export type ReelLang = "en" | "sw";
export const REELS: Record<ReelLang, ReelChapter[]> = {
 "en": [
  {
   "key": "intro",
   "title": "Welcome",
   "vo": "/howitworks/vo/01-intro.mp3",
   "durationMs": 4128,
   "words": [
    {
     "text": "Hey",
     "start_ms": 80,
     "end_ms": 205
    },
    {
     "text": "this",
     "start_ms": 227,
     "end_ms": 443
    },
    {
     "text": "is",
     "start_ms": 455,
     "end_ms": 568
    },
    {
     "text": "Motokah",
     "start_ms": 580,
     "end_ms": 1239
    },
    {
     "text": "Buy",
     "start_ms": 1602,
     "end_ms": 1773
    },
    {
     "text": "and",
     "start_ms": 1784,
     "end_ms": 1886
    },
    {
     "text": "sell",
     "start_ms": 1898,
     "end_ms": 2125
    },
    {
     "text": "vehicles",
     "start_ms": 2136,
     "end_ms": 2580
    },
    {
     "text": "across",
     "start_ms": 2591,
     "end_ms": 2943
    },
    {
     "text": "East",
     "start_ms": 3023,
     "end_ms": 3250
    },
    {
     "text": "Africa",
     "start_ms": 3261,
     "end_ms": 3795
    }
   ],
   "beats": []
  },
  {
   "key": "home",
   "title": "Browse",
   "vo": "/howitworks/vo/02-home.mp3",
   "durationMs": 6432,
   "words": [
    {
     "text": "Jump",
     "start_ms": 68,
     "end_ms": 330
    },
    {
     "text": "in",
     "start_ms": 341,
     "end_ms": 455
    },
    {
     "text": "on",
     "start_ms": 466,
     "end_ms": 580
    },
    {
     "text": "the",
     "start_ms": 591,
     "end_ms": 659
    },
    {
     "text": "home",
     "start_ms": 670,
     "end_ms": 909
    },
    {
     "text": "page",
     "start_ms": 920,
     "end_ms": 1386
    },
    {
     "text": "Cars",
     "start_ms": 1750,
     "end_ms": 2125
    },
    {
     "text": "bikes",
     "start_ms": 2148,
     "end_ms": 2466
    },
    {
     "text": "and",
     "start_ms": 2477,
     "end_ms": 2545
    },
    {
     "text": "trucks",
     "start_ms": 2557,
     "end_ms": 2898
    },
    {
     "text": "are",
     "start_ms": 2909,
     "end_ms": 3057
    },
    {
     "text": "all",
     "start_ms": 3068,
     "end_ms": 3216
    },
    {
     "text": "sorted",
     "start_ms": 3227,
     "end_ms": 3580
    },
    {
     "text": "into",
     "start_ms": 3591,
     "end_ms": 3784
    },
    {
     "text": "categories",
     "start_ms": 3795,
     "end_ms": 4443
    },
    {
     "text": "so",
     "start_ms": 4693,
     "end_ms": 4784
    },
    {
     "text": "you",
     "start_ms": 4795,
     "end_ms": 4920
    },
    {
     "text": "find",
     "start_ms": 4932,
     "end_ms": 5170
    },
    {
     "text": "your",
     "start_ms": 5182,
     "end_ms": 5295
    },
    {
     "text": "ride",
     "start_ms": 5307,
     "end_ms": 5545
    },
    {
     "text": "fast",
     "start_ms": 5557,
     "end_ms": 6091
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/01-home-full.jpg",
     "h": 4200,
     "from": 0,
     "scrollTo": 1500
    },
    {
     "src": "/howitworks/shots/01-home.jpg",
     "h": 844,
     "from": 5017,
     "tap": {
      "x": 143,
      "y": 299,
      "at": 1119
     }
    }
   ]
  },
  {
   "key": "search",
   "title": "Search",
   "vo": "/howitworks/vo/03-search.mp3",
   "durationMs": 5688,
   "words": [
    {
     "text": "Know",
     "start_ms": 80,
     "end_ms": 216
    },
    {
     "text": "what",
     "start_ms": 227,
     "end_ms": 375
    },
    {
     "text": "you",
     "start_ms": 386,
     "end_ms": 523
    },
    {
     "text": "want",
     "start_ms": 534,
     "end_ms": 1000
    },
    {
     "text": "Search",
     "start_ms": 1364,
     "end_ms": 1659
    },
    {
     "text": "for",
     "start_ms": 1670,
     "end_ms": 1864
    },
    {
     "text": "it",
     "start_ms": 1875,
     "end_ms": 2011
    },
    {
     "text": "then",
     "start_ms": 2364,
     "end_ms": 2523
    },
    {
     "text": "use",
     "start_ms": 2534,
     "end_ms": 2739
    },
    {
     "text": "the",
     "start_ms": 2750,
     "end_ms": 2841
    },
    {
     "text": "filters",
     "start_ms": 2852,
     "end_ms": 3273
    },
    {
     "text": "to",
     "start_ms": 3284,
     "end_ms": 3386
    },
    {
     "text": "narrow",
     "start_ms": 3398,
     "end_ms": 3716
    },
    {
     "text": "it",
     "start_ms": 3727,
     "end_ms": 3818
    },
    {
     "text": "down",
     "start_ms": 3830,
     "end_ms": 4057
    },
    {
     "text": "by",
     "start_ms": 4068,
     "end_ms": 4182
    },
    {
     "text": "make",
     "start_ms": 4193,
     "end_ms": 4511
    },
    {
     "text": "price",
     "start_ms": 4534,
     "end_ms": 4852
    },
    {
     "text": "and",
     "start_ms": 4864,
     "end_ms": 4943
    },
    {
     "text": "more",
     "start_ms": 4955,
     "end_ms": 5341
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/02-search.jpg",
     "h": 844,
     "from": 0,
     "tap": {
      "x": 60,
      "y": 220,
      "at": 1820
     }
    },
    {
     "src": "/howitworks/shots/02-filters.jpg",
     "h": 844,
     "from": 2275,
     "tap": {
      "x": 284,
      "y": 807,
      "at": 1622
     }
    },
    {
     "src": "/howitworks/shots/02-search.jpg",
     "h": 844,
     "from": 4437,
     "tap": {
      "x": 195,
      "y": 450,
      "at": 1021
     }
    }
   ]
  },
  {
   "key": "listing",
   "title": "Car details",
   "vo": "/howitworks/vo/04-listing.mp3",
   "durationMs": 4296,
   "words": [
    {
     "text": "Tap",
     "start_ms": 80,
     "end_ms": 284
    },
    {
     "text": "any",
     "start_ms": 295,
     "end_ms": 455
    },
    {
     "text": "vehicle",
     "start_ms": 466,
     "end_ms": 841
    },
    {
     "text": "to",
     "start_ms": 852,
     "end_ms": 955
    },
    {
     "text": "see",
     "start_ms": 966,
     "end_ms": 1182
    },
    {
     "text": "all",
     "start_ms": 1193,
     "end_ms": 1352
    },
    {
     "text": "the",
     "start_ms": 1364,
     "end_ms": 1455
    },
    {
     "text": "photos",
     "start_ms": 1466,
     "end_ms": 1864
    },
    {
     "text": "and",
     "start_ms": 1875,
     "end_ms": 1943
    },
    {
     "text": "the",
     "start_ms": 1955,
     "end_ms": 2034
    },
    {
     "text": "key",
     "start_ms": 2045,
     "end_ms": 2250
    },
    {
     "text": "specs",
     "start_ms": 2261,
     "end_ms": 2716
    },
    {
     "text": "right",
     "start_ms": 2739,
     "end_ms": 2977
    },
    {
     "text": "there",
     "start_ms": 2989,
     "end_ms": 3148
    },
    {
     "text": "in",
     "start_ms": 3159,
     "end_ms": 3261
    },
    {
     "text": "one",
     "start_ms": 3273,
     "end_ms": 3455
    },
    {
     "text": "place",
     "start_ms": 3466,
     "end_ms": 3943
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/03-listing.jpg",
     "h": 844,
     "from": 0,
     "tap": {
      "x": 342,
      "y": 294,
      "at": 992
     }
    },
    {
     "src": "/howitworks/shots/03-listing-full.jpg",
     "h": 4067,
     "from": 1804,
     "scrollFrom": 0,
     "scrollTo": 1450
    }
   ]
  },
  {
   "key": "contact",
   "title": "Contact the seller",
   "vo": "/howitworks/vo/05-contact.mp3",
   "durationMs": 4584,
   "words": [
    {
     "text": "Love",
     "start_ms": 68,
     "end_ms": 295
    },
    {
     "text": "it",
     "start_ms": 307,
     "end_ms": 545
    },
    {
     "text": "Message",
     "start_ms": 909,
     "end_ms": 1295
    },
    {
     "text": "the",
     "start_ms": 1307,
     "end_ms": 1398
    },
    {
     "text": "seller",
     "start_ms": 1409,
     "end_ms": 1739
    },
    {
     "text": "right",
     "start_ms": 1750,
     "end_ms": 1932
    },
    {
     "text": "here",
     "start_ms": 1943,
     "end_ms": 2148
    },
    {
     "text": "in",
     "start_ms": 2159,
     "end_ms": 2239
    },
    {
     "text": "the",
     "start_ms": 2250,
     "end_ms": 2352
    },
    {
     "text": "app",
     "start_ms": 2364,
     "end_ms": 2648
    },
    {
     "text": "or",
     "start_ms": 3080,
     "end_ms": 3170
    },
    {
     "text": "give",
     "start_ms": 3182,
     "end_ms": 3352
    },
    {
     "text": "them",
     "start_ms": 3364,
     "end_ms": 3500
    },
    {
     "text": "a",
     "start_ms": 3511,
     "end_ms": 3568
    },
    {
     "text": "quick",
     "start_ms": 3580,
     "end_ms": 3807
    },
    {
     "text": "call",
     "start_ms": 3818,
     "end_ms": 4250
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/03-listing-full.jpg",
     "h": 4067,
     "from": 0,
     "scrollFrom": 1500,
     "scrollTo": 1450,
     "tap": {
      "x": 195,
      "y": 1797,
      "at": 1891
     }
    },
    {
     "src": "/howitworks/shots/04-messages.jpg",
     "h": 844,
     "from": 2521,
     "zoom": {
      "x": 195,
      "y": 234,
      "scale": 1.12
     }
    }
   ]
  },
  {
   "key": "sell",
   "title": "Sell your car",
   "vo": "/howitworks/vo/06-sell.mp3",
   "durationMs": 8688,
   "words": [
    {
     "text": "Selling",
     "start_ms": 48,
     "end_ms": 377
    },
    {
     "text": "is",
     "start_ms": 389,
     "end_ms": 548
    },
    {
     "text": "easy",
     "start_ms": 559,
     "end_ms": 1025
    },
    {
     "text": "Tap",
     "start_ms": 1386,
     "end_ms": 1591
    },
    {
     "text": "Sell",
     "start_ms": 1602,
     "end_ms": 1932
    },
    {
     "text": "pick",
     "start_ms": 1955,
     "end_ms": 2148
    },
    {
     "text": "your",
     "start_ms": 2159,
     "end_ms": 2261
    },
    {
     "text": "make",
     "start_ms": 2273,
     "end_ms": 2477
    },
    {
     "text": "and",
     "start_ms": 2489,
     "end_ms": 2557
    },
    {
     "text": "model",
     "start_ms": 2568,
     "end_ms": 2909
    },
    {
     "text": "and",
     "start_ms": 3182,
     "end_ms": 3261
    },
    {
     "text": "the",
     "start_ms": 3273,
     "end_ms": 3364
    },
    {
     "text": "details",
     "start_ms": 3375,
     "end_ms": 3818
    },
    {
     "text": "fill",
     "start_ms": 3830,
     "end_ms": 4011
    },
    {
     "text": "themselves",
     "start_ms": 4023,
     "end_ms": 4682
    },
    {
     "text": "Add",
     "start_ms": 5045,
     "end_ms": 5216
    },
    {
     "text": "your",
     "start_ms": 5227,
     "end_ms": 5341
    },
    {
     "text": "photos",
     "start_ms": 5352,
     "end_ms": 5739
    },
    {
     "text": "submit",
     "start_ms": 5761,
     "end_ms": 6261
    },
    {
     "text": "and",
     "start_ms": 6284,
     "end_ms": 6409
    },
    {
     "text": "our",
     "start_ms": 6420,
     "end_ms": 6523
    },
    {
     "text": "team",
     "start_ms": 6534,
     "end_ms": 6784
    },
    {
     "text": "reviews",
     "start_ms": 6795,
     "end_ms": 7170
    },
    {
     "text": "it",
     "start_ms": 7182,
     "end_ms": 7284
    },
    {
     "text": "before",
     "start_ms": 7295,
     "end_ms": 7591
    },
    {
     "text": "it",
     "start_ms": 7602,
     "end_ms": 7659
    },
    {
     "text": "goes",
     "start_ms": 7670,
     "end_ms": 7909
    },
    {
     "text": "live",
     "start_ms": 7920,
     "end_ms": 8341
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/01-home.jpg",
     "h": 844,
     "from": 0,
     "tap": {
      "x": 195,
      "y": 797,
      "at": 851
     }
    },
    {
     "src": "/howitworks/shots/05-sell-picker.jpg",
     "h": 844,
     "from": 1216,
     "tap": {
      "x": 195,
      "y": 209,
      "at": 1217
     }
    },
    {
     "src": "/howitworks/shots/05-sell-autofill.jpg",
     "h": 844,
     "from": 2954,
     "zoom": {
      "x": 195,
      "y": 420,
      "scale": 1.1
     }
    },
    {
     "src": "/howitworks/shots/05-sell-photos.jpg",
     "h": 844,
     "from": 5387,
     "tap": {
      "x": 195,
      "y": 338,
      "at": 1688
     }
    }
   ]
  },
  {
   "key": "myads",
   "title": "My Ads",
   "vo": "/howitworks/vo/07-myads.mp3",
   "durationMs": 5640,
   "words": [
    {
     "text": "Then",
     "start_ms": 80,
     "end_ms": 261
    },
    {
     "text": "manage",
     "start_ms": 273,
     "end_ms": 580
    },
    {
     "text": "your",
     "start_ms": 591,
     "end_ms": 773
    },
    {
     "text": "ads",
     "start_ms": 784,
     "end_ms": 1057
    },
    {
     "text": "from",
     "start_ms": 1068,
     "end_ms": 1216
    },
    {
     "text": "your",
     "start_ms": 1227,
     "end_ms": 1341
    },
    {
     "text": "profile",
     "start_ms": 1352,
     "end_ms": 2000
    },
    {
     "text": "Edit",
     "start_ms": 2364,
     "end_ms": 2625
    },
    {
     "text": "them",
     "start_ms": 2636,
     "end_ms": 2807
    },
    {
     "text": "anytime",
     "start_ms": 2818,
     "end_ms": 3409
    },
    {
     "text": "or",
     "start_ms": 3432,
     "end_ms": 3557
    },
    {
     "text": "mark",
     "start_ms": 3568,
     "end_ms": 3830
    },
    {
     "text": "them",
     "start_ms": 3841,
     "end_ms": 3989
    },
    {
     "text": "as",
     "start_ms": 4000,
     "end_ms": 4091
    },
    {
     "text": "sold",
     "start_ms": 4102,
     "end_ms": 4409
    },
    {
     "text": "once",
     "start_ms": 4420,
     "end_ms": 4659
    },
    {
     "text": "they're",
     "start_ms": 4670,
     "end_ms": 4841
    },
    {
     "text": "gone",
     "start_ms": 4852,
     "end_ms": 5284
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/06-myads.jpg",
     "h": 844,
     "from": 0,
     "tap": {
      "x": 203,
      "y": 253,
      "at": 2171
     }
    },
    {
     "src": "/howitworks/shots/06-myads-full.jpg",
     "h": 1237,
     "from": 3102,
     "scrollTo": 393
    }
   ]
  },
  {
   "key": "language",
   "title": "Language",
   "vo": "/howitworks/vo/08-language.mp3",
   "durationMs": 7584,
   "words": [
    {
     "text": "Motokah",
     "start_ms": 80,
     "end_ms": 557
    },
    {
     "text": "speaks",
     "start_ms": 568,
     "end_ms": 909
    },
    {
     "text": "your",
     "start_ms": 920,
     "end_ms": 1045
    },
    {
     "text": "language",
     "start_ms": 1057,
     "end_ms": 1659
    },
    {
     "text": "Switch",
     "start_ms": 2023,
     "end_ms": 2307
    },
    {
     "text": "between",
     "start_ms": 2318,
     "end_ms": 2682
    },
    {
     "text": "English",
     "start_ms": 2693,
     "end_ms": 3114
    },
    {
     "text": "Swahili",
     "start_ms": 3261,
     "end_ms": 3875
    },
    {
     "text": "French",
     "start_ms": 4216,
     "end_ms": 4523
    },
    {
     "text": "and",
     "start_ms": 4534,
     "end_ms": 4636
    },
    {
     "text": "Arabic",
     "start_ms": 4648,
     "end_ms": 5114
    },
    {
     "text": "and",
     "start_ms": 5386,
     "end_ms": 5477
    },
    {
     "text": "see",
     "start_ms": 5489,
     "end_ms": 5682
    },
    {
     "text": "prices",
     "start_ms": 5693,
     "end_ms": 6125
    },
    {
     "text": "in",
     "start_ms": 6136,
     "end_ms": 6227
    },
    {
     "text": "your",
     "start_ms": 6239,
     "end_ms": 6352
    },
    {
     "text": "local",
     "start_ms": 6364,
     "end_ms": 6659
    },
    {
     "text": "currency",
     "start_ms": 6670,
     "end_ms": 7250
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/07-language.jpg",
     "h": 844,
     "from": 0,
     "zoom": {
      "x": 240,
      "y": 480,
      "scale": 1.08
     },
     "tap": {
      "x": 303,
      "y": 457,
      "at": 3615
     }
    }
   ]
  },
  {
   "key": "outro",
   "title": "Get started",
   "vo": "/howitworks/vo/09-outro.mp3",
   "durationMs": 4176,
   "words": [
    {
     "text": "So",
     "start_ms": 57,
     "end_ms": 193
    },
    {
     "text": "what",
     "start_ms": 205,
     "end_ms": 341
    },
    {
     "text": "are",
     "start_ms": 352,
     "end_ms": 432
    },
    {
     "text": "you",
     "start_ms": 443,
     "end_ms": 580
    },
    {
     "text": "waiting",
     "start_ms": 591,
     "end_ms": 920
    },
    {
     "text": "for",
     "start_ms": 932,
     "end_ms": 1318
    },
    {
     "text": "Download",
     "start_ms": 1682,
     "end_ms": 2057
    },
    {
     "text": "Motokah",
     "start_ms": 2068,
     "end_ms": 2602
    },
    {
     "text": "and",
     "start_ms": 2614,
     "end_ms": 2716
    },
    {
     "text": "post",
     "start_ms": 2727,
     "end_ms": 3045
    },
    {
     "text": "your",
     "start_ms": 3057,
     "end_ms": 3159
    },
    {
     "text": "car",
     "start_ms": 3170,
     "end_ms": 3409
    },
    {
     "text": "today",
     "start_ms": 3420,
     "end_ms": 3841
    }
   ],
   "beats": []
  }
 ],
 "sw": [
  {
   "key": "intro",
   "title": "Karibu",
   "vo": "/howitworks/vo-sw/01-intro.mp3",
   "durationMs": 5376,
   "words": [
    {
     "text": "Karibu",
     "start_ms": 158,
     "end_ms": 409
    },
    {
     "text": "Motokah",
     "start_ms": 493,
     "end_ms": 1055
    },
    {
     "text": "Nunua",
     "start_ms": 1962,
     "end_ms": 2213
    },
    {
     "text": "na",
     "start_ms": 2321,
     "end_ms": 2404
    },
    {
     "text": "uza",
     "start_ms": 2440,
     "end_ms": 2655
    },
    {
     "text": "magari",
     "start_ms": 2679,
     "end_ms": 3098
    },
    {
     "text": "kote",
     "start_ms": 3134,
     "end_ms": 3421
    },
    {
     "text": "Afrika",
     "start_ms": 3457,
     "end_ms": 3864
    },
    {
     "text": "Mashariki",
     "start_ms": 3888,
     "end_ms": 4545
    }
   ],
   "beats": []
  },
  {
   "key": "home",
   "title": "Vinjari",
   "vo": "/howitworks/vo-sw/02-home.mp3",
   "durationMs": 8424,
   "words": [
    {
     "text": "Anza",
     "start_ms": 170,
     "end_ms": 373
    },
    {
     "text": "kwenye",
     "start_ms": 481,
     "end_ms": 696
    },
    {
     "text": "ukurasa",
     "start_ms": 732,
     "end_ms": 1222
    },
    {
     "text": "wa",
     "start_ms": 1246,
     "end_ms": 1330
    },
    {
     "text": "mwanzo",
     "start_ms": 1354,
     "end_ms": 1856
    },
    {
     "text": "Magari",
     "start_ms": 2763,
     "end_ms": 3182
    },
    {
     "text": "pikipiki",
     "start_ms": 3361,
     "end_ms": 3900
    },
    {
     "text": "na",
     "start_ms": 3923,
     "end_ms": 3995
    },
    {
     "text": "malori",
     "start_ms": 4019,
     "end_ms": 4426
    },
    {
     "text": "yamepangwa",
     "start_ms": 4450,
     "end_ms": 5000
    },
    {
     "text": "kwa",
     "start_ms": 5024,
     "end_ms": 5144
    },
    {
     "text": "makundi",
     "start_ms": 5167,
     "end_ms": 5658
    },
    {
     "text": "ili",
     "start_ms": 5766,
     "end_ms": 5993
    },
    {
     "text": "upate",
     "start_ms": 6029,
     "end_ms": 6400
    },
    {
     "text": "unachotaka",
     "start_ms": 6435,
     "end_ms": 7045
    },
    {
     "text": "haraka",
     "start_ms": 7069,
     "end_ms": 7596
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/01-home-full.jpg",
     "h": 4200,
     "from": 0,
     "scrollTo": 1500
    },
    {
     "src": "/howitworks/shots/01-home.jpg",
     "h": 844,
     "from": 6571,
     "tap": {
      "x": 143,
      "y": 299,
      "at": 1382
     }
    }
   ]
  },
  {
   "key": "search",
   "title": "Tafuta",
   "vo": "/howitworks/vo-sw/03-search.mp3",
   "durationMs": 6888,
   "words": [
    {
     "text": "Unatafuta",
     "start_ms": 182,
     "end_ms": 708
    },
    {
     "text": "kitu",
     "start_ms": 828,
     "end_ms": 1103
    },
    {
     "text": "maalum",
     "start_ms": 1138,
     "end_ms": 1629
    },
    {
     "text": "Tafuta",
     "start_ms": 2536,
     "end_ms": 2895
    },
    {
     "text": "kisha",
     "start_ms": 3086,
     "end_ms": 3385
    },
    {
     "text": "tumia",
     "start_ms": 3421,
     "end_ms": 3756
    },
    {
     "text": "vichujio",
     "start_ms": 3780,
     "end_ms": 4282
    },
    {
     "text": "kuchagua",
     "start_ms": 4306,
     "end_ms": 4785
    },
    {
     "text": "chapa",
     "start_ms": 4809,
     "end_ms": 5215
    },
    {
     "text": "bei",
     "start_ms": 5311,
     "end_ms": 5526
    },
    {
     "text": "na",
     "start_ms": 5550,
     "end_ms": 5646
    },
    {
     "text": "zaidi",
     "start_ms": 5670,
     "end_ms": 6065
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/02-search.jpg",
     "h": 844,
     "from": 0,
     "tap": {
      "x": 60,
      "y": 220,
      "at": 2204
     }
    },
    {
     "src": "/howitworks/shots/02-filters.jpg",
     "h": 844,
     "from": 2755,
     "tap": {
      "x": 284,
      "y": 807,
      "at": 1964
     }
    },
    {
     "src": "/howitworks/shots/02-search.jpg",
     "h": 844,
     "from": 5373,
     "tap": {
      "x": 195,
      "y": 450,
      "at": 1179
     }
    }
   ]
  },
  {
   "key": "listing",
   "title": "Maelezo ya gari",
   "vo": "/howitworks/vo-sw/04-listing.mp3",
   "durationMs": 5160,
   "words": [
    {
     "text": "Gusa",
     "start_ms": 158,
     "end_ms": 397
    },
    {
     "text": "gari",
     "start_ms": 481,
     "end_ms": 768
    },
    {
     "text": "lolote",
     "start_ms": 792,
     "end_ms": 1234
    },
    {
     "text": "uone",
     "start_ms": 1270,
     "end_ms": 1581
    },
    {
     "text": "picha",
     "start_ms": 1617,
     "end_ms": 1892
    },
    {
     "text": "zote",
     "start_ms": 1916,
     "end_ms": 2239
    },
    {
     "text": "na",
     "start_ms": 2263,
     "end_ms": 2335
    },
    {
     "text": "maelezo",
     "start_ms": 2359,
     "end_ms": 2825
    },
    {
     "text": "muhimu",
     "start_ms": 2849,
     "end_ms": 3280
    },
    {
     "text": "mahali",
     "start_ms": 3375,
     "end_ms": 3770
    },
    {
     "text": "pamoja",
     "start_ms": 3806,
     "end_ms": 4320
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/03-listing.jpg",
     "h": 844,
     "from": 0,
     "tap": {
      "x": 342,
      "y": 294,
      "at": 1192
     }
    },
    {
     "src": "/howitworks/shots/03-listing-full.jpg",
     "h": 4067,
     "from": 2167,
     "scrollFrom": 0,
     "scrollTo": 1450
    }
   ]
  },
  {
   "key": "contact",
   "title": "Wasiliana na muuzaji",
   "vo": "/howitworks/vo-sw/05-contact.mp3",
   "durationMs": 6912,
   "words": [
    {
     "text": "Umelipenda",
     "start_ms": 182,
     "end_ms": 839
    },
    {
     "text": "Mtumie",
     "start_ms": 1866,
     "end_ms": 2213
    },
    {
     "text": "muuzaji",
     "start_ms": 2321,
     "end_ms": 2859
    },
    {
     "text": "ujumbe",
     "start_ms": 2895,
     "end_ms": 3313
    },
    {
     "text": "hapa",
     "start_ms": 3337,
     "end_ms": 3612
    },
    {
     "text": "hapa",
     "start_ms": 3636,
     "end_ms": 3923
    },
    {
     "text": "kwenye",
     "start_ms": 3959,
     "end_ms": 4199
    },
    {
     "text": "programu",
     "start_ms": 4234,
     "end_ms": 4880
    },
    {
     "text": "au",
     "start_ms": 4964,
     "end_ms": 5156
    },
    {
     "text": "mpigie",
     "start_ms": 5179,
     "end_ms": 5598
    },
    {
     "text": "simu",
     "start_ms": 5634,
     "end_ms": 6077
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/03-listing-full.jpg",
     "h": 4067,
     "from": 0,
     "scrollFrom": 1500,
     "scrollTo": 1450,
     "tap": {
      "x": 195,
      "y": 1797,
      "at": 2852
     }
    },
    {
     "src": "/howitworks/shots/04-messages.jpg",
     "h": 844,
     "from": 3802,
     "zoom": {
      "x": 195,
      "y": 234,
      "scale": 1.12
     }
    }
   ]
  },
  {
   "key": "sell",
   "title": "Uza gari lako",
   "vo": "/howitworks/vo-sw/06-sell.mp3",
   "durationMs": 10008,
   "words": [
    {
     "text": "Gusa",
     "start_ms": 158,
     "end_ms": 373
    },
    {
     "text": "Sell",
     "start_ms": 457,
     "end_ms": 768
    },
    {
     "text": "chagua",
     "start_ms": 863,
     "end_ms": 1234
    },
    {
     "text": "chapa",
     "start_ms": 1270,
     "end_ms": 1593
    },
    {
     "text": "na",
     "start_ms": 1617,
     "end_ms": 1689
    },
    {
     "text": "modeli",
     "start_ms": 1713,
     "end_ms": 2203
    },
    {
     "text": "na",
     "start_ms": 2335,
     "end_ms": 2418
    },
    {
     "text": "maelezo",
     "start_ms": 2442,
     "end_ms": 2897
    },
    {
     "text": "yanajijaza",
     "start_ms": 2933,
     "end_ms": 3627
    },
    {
     "text": "yenyewe",
     "start_ms": 3650,
     "end_ms": 4129
    },
    {
     "text": "Ongeza",
     "start_ms": 5060,
     "end_ms": 5335
    },
    {
     "text": "picha",
     "start_ms": 5443,
     "end_ms": 5766
    },
    {
     "text": "tuma",
     "start_ms": 5885,
     "end_ms": 6244
    },
    {
     "text": "na",
     "start_ms": 6352,
     "end_ms": 6471
    },
    {
     "text": "timu",
     "start_ms": 6507,
     "end_ms": 6782
    },
    {
     "text": "yetu",
     "start_ms": 6806,
     "end_ms": 7069
    },
    {
     "text": "italikagua",
     "start_ms": 7105,
     "end_ms": 7811
    },
    {
     "text": "kabla",
     "start_ms": 7847,
     "end_ms": 8170
    },
    {
     "text": "halijaonekana",
     "start_ms": 8194,
     "end_ms": 9163
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/01-home.jpg",
     "h": 844,
     "from": 0,
     "tap": {
      "x": 195,
      "y": 797,
      "at": 981
     }
    },
    {
     "src": "/howitworks/shots/05-sell-picker.jpg",
     "h": 844,
     "from": 1401,
     "tap": {
      "x": 195,
      "y": 209,
      "at": 1401
     }
    },
    {
     "src": "/howitworks/shots/05-sell-autofill.jpg",
     "h": 844,
     "from": 3403,
     "zoom": {
      "x": 195,
      "y": 420,
      "scale": 1.1
     }
    },
    {
     "src": "/howitworks/shots/05-sell-photos.jpg",
     "h": 844,
     "from": 6205,
     "tap": {
      "x": 195,
      "y": 338,
      "at": 1914
     }
    }
   ]
  },
  {
   "key": "myads",
   "title": "Matangazo yangu",
   "vo": "/howitworks/vo-sw/07-myads.mp3",
   "durationMs": 7632,
   "words": [
    {
     "text": "Kisha",
     "start_ms": 158,
     "end_ms": 325
    },
    {
     "text": "simamia",
     "start_ms": 409,
     "end_ms": 899
    },
    {
     "text": "matangazo",
     "start_ms": 923,
     "end_ms": 1473
    },
    {
     "text": "yako",
     "start_ms": 1497,
     "end_ms": 1761
    },
    {
     "text": "kwenye",
     "start_ms": 1784,
     "end_ms": 2024
    },
    {
     "text": "wasifu",
     "start_ms": 2048,
     "end_ms": 2466
    },
    {
     "text": "wako",
     "start_ms": 2490,
     "end_ms": 2813
    },
    {
     "text": "Yahariri",
     "start_ms": 3696,
     "end_ms": 4067
    },
    {
     "text": "wakati",
     "start_ms": 4163,
     "end_ms": 4510
    },
    {
     "text": "wowote",
     "start_ms": 4534,
     "end_ms": 4988
    },
    {
     "text": "au",
     "start_ms": 5096,
     "end_ms": 5287
    },
    {
     "text": "weka",
     "start_ms": 5311,
     "end_ms": 5574
    },
    {
     "text": "gari",
     "start_ms": 5598,
     "end_ms": 5909
    },
    {
     "text": "kuwa",
     "start_ms": 5945,
     "end_ms": 6148
    },
    {
     "text": "limeuzwa",
     "start_ms": 6172,
     "end_ms": 6782
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/06-myads.jpg",
     "h": 844,
     "from": 0,
     "tap": {
      "x": 203,
      "y": 253,
      "at": 2939
     }
    },
    {
     "src": "/howitworks/shots/06-myads-full.jpg",
     "h": 1237,
     "from": 4198,
     "scrollTo": 393
    }
   ]
  },
  {
   "key": "language",
   "title": "Lugha",
   "vo": "/howitworks/vo-sw/08-language.mp3",
   "durationMs": 7128,
   "words": [
    {
     "text": "Motokah",
     "start_ms": 170,
     "end_ms": 516
    },
    {
     "text": "inapatikana",
     "start_ms": 612,
     "end_ms": 1294
    },
    {
     "text": "kwa",
     "start_ms": 1330,
     "end_ms": 1461
    },
    {
     "text": "Kiingereza",
     "start_ms": 1485,
     "end_ms": 2179
    },
    {
     "text": "Kiswahili",
     "start_ms": 2275,
     "end_ms": 2885
    },
    {
     "text": "Kifaransa",
     "start_ms": 2993,
     "end_ms": 3615
    },
    {
     "text": "na",
     "start_ms": 3638,
     "end_ms": 3722
    },
    {
     "text": "Kiarabu",
     "start_ms": 3758,
     "end_ms": 4320
    },
    {
     "text": "na",
     "start_ms": 4440,
     "end_ms": 4536
    },
    {
     "text": "bei",
     "start_ms": 4560,
     "end_ms": 4787
    },
    {
     "text": "kwa",
     "start_ms": 4823,
     "end_ms": 4942
    },
    {
     "text": "sarafu",
     "start_ms": 4966,
     "end_ms": 5433
    },
    {
     "text": "ya",
     "start_ms": 5469,
     "end_ms": 5540
    },
    {
     "text": "nchi",
     "start_ms": 5576,
     "end_ms": 5899
    },
    {
     "text": "yako",
     "start_ms": 5923,
     "end_ms": 6294
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/07-language.jpg",
     "h": 844,
     "from": 0,
     "zoom": {
      "x": 240,
      "y": 480,
      "scale": 1.08
     },
     "tap": {
      "x": 303,
      "y": 457,
      "at": 3410
     }
    }
   ]
  },
  {
   "key": "outro",
   "title": "Anza sasa",
   "vo": "/howitworks/vo-sw/09-outro.mp3",
   "durationMs": 5496,
   "words": [
    {
     "text": "Basi",
     "start_ms": 170,
     "end_ms": 409
    },
    {
     "text": "unasubiri",
     "start_ms": 505,
     "end_ms": 1186
    },
    {
     "text": "nini",
     "start_ms": 1210,
     "end_ms": 1545
    },
    {
     "text": "Pakua",
     "start_ms": 2440,
     "end_ms": 2655
    },
    {
     "text": "Motokah",
     "start_ms": 2739,
     "end_ms": 3194
    },
    {
     "text": "na",
     "start_ms": 3218,
     "end_ms": 3313
    },
    {
     "text": "uweke",
     "start_ms": 3337,
     "end_ms": 3696
    },
    {
     "text": "gari",
     "start_ms": 3732,
     "end_ms": 3983
    },
    {
     "text": "lako",
     "start_ms": 4007,
     "end_ms": 4306
    },
    {
     "text": "leo",
     "start_ms": 4330,
     "end_ms": 4665
    }
   ],
   "beats": []
  }
 ]
};
export const REELS_SHORT: Record<ReelLang, ReelChapter[]> = {
 "en": [
  {
   "key": "intro",
   "title": "Welcome",
   "vo": "/howitworks/vo-short/01-intro.mp3",
   "durationMs": 1296,
   "tailMs": 336,
   "words": [
    {
     "text": "This",
     "start_ms": 74,
     "end_ms": 222
    },
    {
     "text": "is",
     "start_ms": 233,
     "end_ms": 350
    },
    {
     "text": "Motokah",
     "start_ms": 360,
     "end_ms": 975
    }
   ],
   "beats": []
  },
  {
   "key": "find",
   "title": "Find",
   "vo": "/howitworks/vo-short/02-find.mp3",
   "durationMs": 3384,
   "tailMs": 336,
   "words": [
    {
     "text": "Find",
     "start_ms": 64,
     "end_ms": 350
    },
    {
     "text": "cars",
     "start_ms": 360,
     "end_ms": 731
    },
    {
     "text": "bikes",
     "start_ms": 752,
     "end_ms": 1038
    },
    {
     "text": "and",
     "start_ms": 1049,
     "end_ms": 1112
    },
    {
     "text": "trucks",
     "start_ms": 1123,
     "end_ms": 1420
    },
    {
     "text": "across",
     "start_ms": 1430,
     "end_ms": 1737
    },
    {
     "text": "East",
     "start_ms": 1801,
     "end_ms": 2013
    },
    {
     "text": "Africa",
     "start_ms": 2023,
     "end_ms": 2405
    },
    {
     "text": "in",
     "start_ms": 2415,
     "end_ms": 2542
    },
    {
     "text": "seconds",
     "start_ms": 2553,
     "end_ms": 3061
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/01-home-full.jpg",
     "h": 4200,
     "from": 0,
     "scrollTo": 1100
    },
    {
     "src": "/howitworks/shots/02-search.jpg",
     "h": 844,
     "from": 1861,
     "tap": {
      "x": 195,
      "y": 450,
      "at": 1022
     }
    }
   ]
  },
  {
   "key": "chat",
   "title": "Chat",
   "vo": "/howitworks/vo-short/03-chat.mp3",
   "durationMs": 2664,
   "tailMs": 336,
   "words": [
    {
     "text": "Tap",
     "start_ms": 74,
     "end_ms": 286
    },
    {
     "text": "one",
     "start_ms": 297,
     "end_ms": 519
    },
    {
     "text": "check",
     "start_ms": 540,
     "end_ms": 773
    },
    {
     "text": "the",
     "start_ms": 784,
     "end_ms": 869
    },
    {
     "text": "photos",
     "start_ms": 879,
     "end_ms": 1292
    },
    {
     "text": "and",
     "start_ms": 1314,
     "end_ms": 1441
    },
    {
     "text": "message",
     "start_ms": 1451,
     "end_ms": 1801
    },
    {
     "text": "the",
     "start_ms": 1811,
     "end_ms": 1896
    },
    {
     "text": "seller",
     "start_ms": 1907,
     "end_ms": 2330
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/03-listing.jpg",
     "h": 844,
     "from": 0,
     "tap": {
      "x": 342,
      "y": 294,
      "at": 599
     }
    },
    {
     "src": "/howitworks/shots/04-messages.jpg",
     "h": 844,
     "from": 1332,
     "zoom": {
      "x": 195,
      "y": 234,
      "scale": 1.1
     }
    }
   ]
  },
  {
   "key": "sell",
   "title": "Sell",
   "vo": "/howitworks/vo-short/04-sell.mp3",
   "durationMs": 3576,
   "tailMs": 336,
   "words": [
    {
     "text": "Selling",
     "start_ms": 74,
     "end_ms": 519
    },
    {
     "text": "Pick",
     "start_ms": 858,
     "end_ms": 996
    },
    {
     "text": "your",
     "start_ms": 1006,
     "end_ms": 1102
    },
    {
     "text": "model",
     "start_ms": 1112,
     "end_ms": 1409
    },
    {
     "text": "the",
     "start_ms": 1430,
     "end_ms": 1525
    },
    {
     "text": "details",
     "start_ms": 1536,
     "end_ms": 1981
    },
    {
     "text": "fill",
     "start_ms": 1992,
     "end_ms": 2203
    },
    {
     "text": "in",
     "start_ms": 2214,
     "end_ms": 2341
    },
    {
     "text": "add",
     "start_ms": 2362,
     "end_ms": 2532
    },
    {
     "text": "photos",
     "start_ms": 2542,
     "end_ms": 2924
    },
    {
     "text": "done",
     "start_ms": 2945,
     "end_ms": 3252
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/05-sell-picker.jpg",
     "h": 844,
     "from": 0,
     "tap": {
      "x": 195,
      "y": 209,
      "at": 590
     }
    },
    {
     "src": "/howitworks/shots/05-sell-autofill.jpg",
     "h": 844,
     "from": 1180
    },
    {
     "src": "/howitworks/shots/05-sell-photos.jpg",
     "h": 844,
     "from": 2360,
     "tap": {
      "x": 195,
      "y": 338,
      "at": 621
     }
    }
   ]
  },
  {
   "key": "outro",
   "title": "Get started",
   "vo": "/howitworks/vo-short/05-outro.mp3",
   "durationMs": 2400,
   "tailMs": 336,
   "words": [
    {
     "text": "Download",
     "start_ms": 74,
     "end_ms": 424
    },
    {
     "text": "Motokah",
     "start_ms": 434,
     "end_ms": 932
    },
    {
     "text": "and",
     "start_ms": 943,
     "end_ms": 1038
    },
    {
     "text": "post",
     "start_ms": 1049,
     "end_ms": 1345
    },
    {
     "text": "your",
     "start_ms": 1356,
     "end_ms": 1451
    },
    {
     "text": "car",
     "start_ms": 1462,
     "end_ms": 1684
    },
    {
     "text": "today",
     "start_ms": 1695,
     "end_ms": 2087
    }
   ],
   "beats": []
  }
 ],
 "sw": [
  {
   "key": "intro",
   "title": "Karibu",
   "vo": "/howitworks/vo-sw-short/01-intro.mp3",
   "durationMs": 1608,
   "tailMs": 43,
   "words": [
    {
     "text": "Hii",
     "start_ms": 141,
     "end_ms": 252
    },
    {
     "text": "ni",
     "start_ms": 323,
     "end_ms": 394
    },
    {
     "text": "Motokah",
     "start_ms": 414,
     "end_ms": 890
    }
   ],
   "beats": []
  },
  {
   "key": "find",
   "title": "Tafuta",
   "vo": "/howitworks/vo-sw-short/02-find.mp3",
   "durationMs": 3144,
   "tailMs": 43,
   "words": [
    {
     "text": "Pata",
     "start_ms": 141,
     "end_ms": 263
    },
    {
     "text": "magari",
     "start_ms": 333,
     "end_ms": 769
    },
    {
     "text": "pikipiki",
     "start_ms": 850,
     "end_ms": 1305
    },
    {
     "text": "na",
     "start_ms": 1325,
     "end_ms": 1386
    },
    {
     "text": "malori",
     "start_ms": 1406,
     "end_ms": 1791
    },
    {
     "text": "kwa",
     "start_ms": 1821,
     "end_ms": 1943
    },
    {
     "text": "haraka",
     "start_ms": 1963,
     "end_ms": 2418
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/01-home-full.jpg",
     "h": 4200,
     "from": 0,
     "scrollTo": 1100
    },
    {
     "src": "/howitworks/shots/02-search.jpg",
     "h": 844,
     "from": 1729,
     "tap": {
      "x": 195,
      "y": 450,
      "at": 802
     }
    }
   ]
  },
  {
   "key": "chat",
   "title": "Wasiliana",
   "vo": "/howitworks/vo-sw-short/03-chat.mp3",
   "durationMs": 3120,
   "tailMs": 43,
   "words": [
    {
     "text": "Gusa",
     "start_ms": 141,
     "end_ms": 343
    },
    {
     "text": "gari",
     "start_ms": 414,
     "end_ms": 738
    },
    {
     "text": "ona",
     "start_ms": 839,
     "end_ms": 1042
    },
    {
     "text": "picha",
     "start_ms": 1072,
     "end_ms": 1366
    },
    {
     "text": "mtumie",
     "start_ms": 1447,
     "end_ms": 1842
    },
    {
     "text": "muuzaji",
     "start_ms": 1862,
     "end_ms": 2398
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/03-listing.jpg",
     "h": 844,
     "from": 0,
     "tap": {
      "x": 342,
      "y": 294,
      "at": 702
     }
    },
    {
     "src": "/howitworks/shots/04-messages.jpg",
     "h": 844,
     "from": 1560,
     "zoom": {
      "x": 195,
      "y": 234,
      "scale": 1.1
     }
    }
   ]
  },
  {
   "key": "sell",
   "title": "Uza",
   "vo": "/howitworks/vo-sw-short/04-sell.mp3",
   "durationMs": 4176,
   "tailMs": 43,
   "words": [
    {
     "text": "Unauza",
     "start_ms": 161,
     "end_ms": 597
    },
    {
     "text": "Chagua",
     "start_ms": 1447,
     "end_ms": 1711
    },
    {
     "text": "modeli",
     "start_ms": 1781,
     "end_ms": 2217
    },
    {
     "text": "ongeza",
     "start_ms": 2318,
     "end_ms": 2682
    },
    {
     "text": "picha",
     "start_ms": 2702,
     "end_ms": 2996
    },
    {
     "text": "basi",
     "start_ms": 3077,
     "end_ms": 3441
    }
   ],
   "beats": [
    {
     "src": "/howitworks/shots/05-sell-picker.jpg",
     "h": 844,
     "from": 0,
     "tap": {
      "x": 195,
      "y": 209,
      "at": 689
     }
    },
    {
     "src": "/howitworks/shots/05-sell-autofill.jpg",
     "h": 844,
     "from": 1378
    },
    {
     "src": "/howitworks/shots/05-sell-photos.jpg",
     "h": 844,
     "from": 2756,
     "tap": {
      "x": 195,
      "y": 338,
      "at": 585
     }
    }
   ]
  },
  {
   "key": "outro",
   "title": "Anza sasa",
   "vo": "/howitworks/vo-sw-short/05-outro.mp3",
   "durationMs": 2736,
   "tailMs": 43,
   "words": [
    {
     "text": "Pakua",
     "start_ms": 141,
     "end_ms": 323
    },
    {
     "text": "Motokah",
     "start_ms": 394,
     "end_ms": 779
    },
    {
     "text": "na",
     "start_ms": 799,
     "end_ms": 880
    },
    {
     "text": "uweke",
     "start_ms": 900,
     "end_ms": 1204
    },
    {
     "text": "gari",
     "start_ms": 1234,
     "end_ms": 1447
    },
    {
     "text": "lako",
     "start_ms": 1467,
     "end_ms": 1720
    },
    {
     "text": "leo",
     "start_ms": 1740,
     "end_ms": 2024
    }
   ],
   "beats": []
  }
 ]
};
