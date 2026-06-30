export const PATCH_NOTES_HISTORY = [
    {
        version: "4.1.1",
        date: "2026-03-11",
        title: "The Clarity Update",
        description: "Improving readability and adding more roguelike flair.",
        changes: [
            {
                category: "UI & Readability",
                points: [
                    "CARD COUNTING: Updated the card counting font and color for better visibility.",
                    "ROGUE FONT: Applied the roguelike font to more UI elements."
                ]
            }
        ],
        isNew: true
    },
    {
        version: "4.1.0",
        date: "2026-03-10",
        title: "The Visuals Update",
        description: "A massive leap forward in visual fidelity and immersion.",
        changes: [
            {
                category: "Advanced Visuals",
                points: [
                    "DYNAMIC CAMERA: Zoom and rotate the camera around the table to see the action from any angle.",
                    "ATMOSPHERIC BACKGROUND: Added a starry, cosmic background to the game scene."
                ]
            },
            {
                category: "Skill Tree Expansion",
                points: [
                    "AEGIS I: Gain Shield when you choose to Stand.",
                    "PRECISION I: Increased Critical Hit chance for all attacks.",
                    "CLARITY I: Enhanced Focus gain per card played."
                ]
            },
            {
                category: "Performance & Polish",
                points: [
                    "OPTIMIZED SHADERS: High-performance WebGL rendering for smooth gameplay even on mobile devices."
                ]
            }
        ],
        isNew: true
    },
    {
        version: "3.2.0",
        date: "2026-03-08",
        title: "The Perspective & Polish Update",
        description: "Fixing visual inconsistencies and refining the gameplay experience.",
        changes: [
            {
                category: "Visual Fixes",
                points: [
                    "PERSPECTIVE FIX: Resolved an issue where cards would appear 'upside down' or distorted when flipped due to 3D transform conflicts.",
                    "CLONE ORIENTATION: Cloned cards now correctly appear face-up, matching the card they duplicated.",
                    "ACTIVE HAND GLOW: Added a clearer visual indicator for the currently active hand during multi-hand play."
                ]
            },
            {
                category: "Gameplay Improvements",
                points: [
                    "DEALER LOGIC: Refined dealer transition timing for a smoother round resolution.",
                    "STABILITY: Fixed a rare issue where the 'Embark' button could become unresponsive on certain screen sizes.",
                    "MULTIPLAYER: Added 'Beta' status indicators to the multiplayer lobby."
                ]
            },
            {
                category: "Upgrades",
                points: [
                    "Runic Forge: New upgrade path for relics.",
                    "Synergy Core: Enhanced synergy bonuses."
                ]
            }
        ],
        isNew: false
    },
    {
        version: "3.1.0",
        date: "2026-03-06",
        title: "The Customization Update",
        description: "A major UI overhaul for the Exchange and Wallet screens, plus new customization options.",
        changes: [
            {
                category: "UI & UX Overhaul",
                points: [
                    "EXCHANGE TAB: Complete redesign of the Exchange screen with a new layout, improved navigation, and better scrolling support.",
                    "WALLET SCREEN: Upgraded Wallet UI with modern styling, clearer balance displays, and enhanced deposit simulation.",
                    "MAIN MENU: Added a dedicated Customization tab with a new icon for better accessibility.",
                    "NAVIGATION: Added consistent 'Back to Menu' buttons across all customization and wallet screens."
                ]
            },
            {
                category: "Bug Fixes",
                points: [
                    "EXCHANGE SCROLLING: Fixed an issue where the Exchange screen was not scrollable on mobile devices.",
                    "UI CONSISTENCY: Standardized button styles and navigation patterns across the entire app."
                ]
            }
        ],
        isNew: false
    },
    {
        version: "3.0.0",
        date: "2026-03-06",
        title: "The Void Awakening",
        description: "Season 1 has arrived! The void ripples through the deck, bringing new challenges and the mysterious Mystic Altar.",
        changes: [
            {
                category: "Season 1: The Void Awakening",
                points: [
                    "NEW SEASONAL EVENT: The Mystic Altar (Appears every 7 floors).",
                    "VOID REWARDS: Claim powerful buffs like Void Shards and Void Vitality.",
                    "SEASON PROGRESSION: Track your contribution to the global Void Burn.",
                    "ATMOSPHERIC UI: New visual effects and transitions for the Void theme.",
                    "BUG FIXES: Resolved recursive chain issues with Clones and Magnets.",
                    "POLISH: Smoother screen transitions and enhanced card interactivity."
                ]
            },
            {
                category: "Gameplay & Logic Updates",
                points: [
                    "LOGIC FIXES: Dealer blackjack now correctly beats player 21. Variable card values (Aces) are now calculated robustly.",
                    "EVENT FIXES: Floor events (Bonfire, Stranger, Seasonal) now correctly trigger only once at the start of the floor.",
                    "MINIGAMES: Plinko, Spin Wheel, High Low, Dice Roll, and Shell Game fully integrated.",
                    "MULTIPLAYER: Initial multiplayer lobby and synchronization framework.",
                    "CUSTOMIZATION: Unlockable Card Backs and Table Felts.",
                    "META PROGRESSION: Run History, Achievements, and Leaderboards.",
                    "ENCOUNTERS: Bonfire resting, Stranger pacts, and Shop interactions."
                ]
            }
        ]
    },
    {
        version: "2.7.0",
        date: "2025-05-15",
        title: "The Scaling Update",
        changes: [
            {
                category: "UI & Layout Overhaul",
                points: [
                    "BLACKJACK TABLE: Significantly increased table height (nearly double) for better visibility and immersion.",
                    "MOBILE OPTIMIZATION: The Potion Belt is now a toggleable modal on mobile devices, freeing up valuable screen space.",
                    "CARD SPACING: Increased separation between Player and Dealer hands to prevent clutter.",
                    "COMPACT ACTIONS: Player action buttons are now more compact and better positioned on smaller screens.",
                    "READABILITY: Adjusted font sizes and element scaling across the board for a cleaner look."
                ]
            },
            {
                category: "Bug Fixes",
                points: [
                    "WHEEL OF FATE: Fixed visual rendering issues with the Wheel of Fate's segments.",
                    "LAYOUT: Resolved issues where UI elements would overlap or be cut off on certain aspect ratios.",
                    "PERFORMANCE: Minor optimizations to rendering performance."
                ]
            }
        ]
    },
    {
        version: "Roadmap",
        date: "Future",
        title: "The Road Ahead",
        changes: [
            {
                category: "Currently In Development",
                points: [
                    "GUILD SYSTEM: Create and join guilds, share resources, and battle guild bosses.",
                    "PVP TOURNAMENTS: Weekly brackets with massive shard prizes.",
                    "MOBILE OPTIMIZATION: Enhanced touch controls, haptic feedback profiles, and battery saver mode.",
                    "DESKTOP VERSION: Dedicated PC client with ultra-wide support, high-res textures, and customizable hotkeys.",
                    "STEAM DECK VERIFIED: Full controller support and optimized UI for handheld play.",
                    "NEW CLASS - THE TRICKSTER: A new playable archetype with unique card manipulation abilities.",
                    "ENDLESS DUNGEON: A procedurally generated dungeon crawler mode using blackjack mechanics.",
                    "COMMUNITY CARDS: A tool for players to design and vote on new modifier cards.",
                    "TWITCH INTEGRATION: Let chat vote on your next hand or send you buffs/debuffs.",
                    "MODDING TOOLS: Support for custom card skins and community-made relics."
                ]
            }
        ]
    }
];
