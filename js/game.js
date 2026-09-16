/*
=========================================================
 SHADID AHAMED — PORTFOLIO GAME ENGINE
 File: js/game.js
=========================================================

 GAME: NOCLIP — PORTFOLIO RUN
 -----------------------------------------------
 A lightweight original browser game engine built
 specifically for the portfolio.

 FEATURES
 -----------------------------------------------
 ✓ Canvas-based 2.5D rendering
 ✓ Procedural road / environment
 ✓ Infinite-style progression
 ✓ Player movement
 ✓ Obstacles
 ✓ Collectibles
 ✓ Health system
 ✓ Score + distance
 ✓ Combo system
 ✓ Difficulty progression
 ✓ Particles
 ✓ Screen shake
 ✓ Dynamic lighting
 ✓ Keyboard controls
 ✓ Touch / pointer controls
 ✓ Pause / resume
 ✓ Restart
 ✓ Start screen
 ✓ Game-over screen
 ✓ Performance diagnostics
 ✓ Adaptive quality
 ✓ Local high score
 ✓ Public API
 ✓ No external libraries

 IMPORTANT
 -----------------------------------------------
 This is an original portfolio-game framework.
 It does not copy characters, assets, maps, dialogue,
 or protected game content from another game.

=========================================================
*/

(function () {
    "use strict";

    /* =====================================================
       GLOBALS
    ===================================================== */

    const win = window;
    const doc = document;

    const GAME_ID = "shadid-noclip";

    const STORAGE_KEY =
        "shadid_portfolio_game_highscore";

    let canvas = null;
    let ctx = null;

    let game = null;

    let animationFrame = null;
    let lastTime = 0;

    let input = {
        left: false,
        right: false,
        up: false,
        down: false,
        boost: false
    };

    let pointer = {
        active: false,
        x: 0,
        y: 0
    };

    let touchControls = {
        left: false,
        right: false,
        boost: false
    };

    let audioContext = null;

    let highScore = loadHighScore();


    /* =====================================================
       UTILITIES
    ===================================================== */

    function $(selector, parent = doc) {
        return parent.querySelector(selector);
    }

    function $$(selector, parent = doc) {
        return Array.from(
            parent.querySelectorAll(selector)
        );
    }

    function clamp(value, min, max) {
        return Math.min(
            Math.max(value, min),
            max
        );
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function random(min, max) {
        return Math.random() *
            (max - min) +
            min;
    }

    function randomInt(min, max) {
        return Math.floor(
            random(min, max + 1)
        );
    }

    function distance(x1, y1, x2, y2) {
        return Math.hypot(
            x2 - x1,
            y2 - y1
        );
    }

    function now() {
        return performance.now();
    }


    /* =====================================================
       HIGH SCORE
    ===================================================== */

    function loadHighScore() {
        try {
            return Number(
                localStorage.getItem(
                    STORAGE_KEY
                )
            ) || 0;
        } catch (_) {
            return 0;
        }
    }

    function saveHighScore(value) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                String(Math.floor(value))
            );
        } catch (_) {}
    }


    /* =====================================================
       GAME STATE
    ===================================================== */

    function createGameState() {

        return {

            status: "menu",

            score: 0,

            distance: 0,

            combo: 0,

            comboTimer: 0,

            health: 100,

            energy: 100,

            speed: 0,

            baseSpeed: 0.42,

            maxSpeed: 1.25,

            difficulty: 1,

            level: 1,

            elapsed: 0,

            frame: 0,

            shake: 0,

            flash: 0,

            spawnTimer: 0,

            collectibleTimer: 0,

            environmentTimer: 0,

            lastDamage: 0,

            passedObjects: 0,

            collected: 0,

            nearMisses: 0,

            boosts: 0,

            quality: "high",

            fps: 60,

            fpsSamples: [],

            lastFpsUpdate: 0,

            worldOffset: 0,

            player: {

                x: 0,

                targetX: 0,

                y: 0,

                width: 0.16,

                height: 0.12,

                tilt: 0,

                glow: 0,

                invulnerable: 0

            },

            obstacles: [],

            collectibles: [],

            particles: [],

            environment: [],

            stars: [],

            roadMarks: [],

            messages: [],

            flashMessages: [],

            camera: {

                shakeX: 0,

                shakeY: 0,

                horizon: 0.38,

                perspective: 0.82

            },

            stats: {

                bestCombo: 0,

                bestSpeed: 0,

                timePlayed: 0

            }

        };
    }


    /* =====================================================
       DOM DISCOVERY
    ===================================================== */

    function findCanvas() {

        canvas =
            $(
                "#gameCanvas, " +
                "#game-canvas, " +
                "[data-game-canvas]"
            );

        if (!canvas) {

            const section =
                $(
                    "#game, " +
                    "#games, " +
                    "[data-game-section]"
                );

            if (section) {

                canvas =
                    doc.createElement(
                        "canvas"
                    );

                canvas.id =
                    "gameCanvas";

                canvas.setAttribute(
                    "aria-label",
                    "Interactive portfolio game"
                );

                section.appendChild(
                    canvas
                );
            }
        }

        if (!canvas) {
            return false;
        }

        ctx =
            canvas.getContext(
                "2d",
                {
                    alpha: false,
                    desynchronized: true
                }
            );

        return Boolean(ctx);
    }


    /* =====================================================
       CANVAS RESOLUTION
    ===================================================== */

    function resizeCanvas() {

        if (!canvas || !ctx) {
            return;
        }

        const rect =
            canvas.getBoundingClientRect();

        const dpr =
            Math.min(
                win.devicePixelRatio || 1,
                game?.quality === "low"
                    ? 1
                    : 2
            );

        const width =
            Math.max(
                320,
                rect.width ||
                canvas.clientWidth ||
                960
            );

        const height =
            Math.max(
                240,
                rect.height ||
                canvas.clientHeight ||
                540
            );

        canvas.width =
            Math.floor(
                width * dpr
            );

        canvas.height =
            Math.floor(
                height * dpr
            );

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        canvas._logicalWidth =
            width;

        canvas._logicalHeight =
            height;
    }


    /* =====================================================
       WORLD INITIALIZATION
    ===================================================== */

    function initializeWorld() {

        if (!game) {
            game =
                createGameState();
        }

        game.stars = [];

        const starCount =
            game.quality === "low"
                ? 45
                : game.quality === "medium"
                    ? 75
                    : 110;

        for (
            let i = 0;
            i < starCount;
            i++
        ) {

            game.stars.push({
                x: random(0, 1),
                y: random(0, 0.6),
                size: random(.4, 1.8),
                depth: random(.1, 1),
                twinkle: random(0, Math.PI * 2)
            });
        }

        game.environment = [];

        for (
            let i = 0;
            i < 30;
            i++
        ) {

            game.environment.push(
                createEnvironmentObject(
                    random(-1, 1),
                    random(0, 1)
                )
            );
        }

        game.roadMarks = [];

        for (
            let i = 0;
            i < 24;
            i++
        ) {

            game.roadMarks.push({
                z: i / 24,
                lane: randomInt(-1, 1)
            });
        }
    }


    function createEnvironmentObject(x, z) {

        const types = [
            "pillar",
            "tree",
            "light",
            "building",
            "crystal",
            "sign"
        ];

        return {

            type:
                types[
                    randomInt(
                        0,
                        types.length - 1
                    )
                ],

            x,

            z,

            scale:
                random(.5, 1.35),

            rotation:
                random(
                    -0.15,
                    0.15
                ),

            brightness:
                random(.3, 1),

            seed:
                Math.random() * 1000
        };
    }


    /* =====================================================
       GAME RESET
    ===================================================== */

    function resetGame() {

        game =
            createGameState();

        game.status = "playing";

        initializeWorld();

        game.player.x = 0;
        game.player.targetX = 0;

        game.speed =
            game.baseSpeed;

        lastTime = now();

        updateGameUI();

        emitGameEvent(
            "portfolio:game-start"
        );
    }


    /* =====================================================
       START / PAUSE / RESUME / END
    ===================================================== */

    function startGame() {

        if (
            game?.status ===
            "playing"
        ) {
            return;
        }

        resetGame();

        ensureAudio();

        startLoop();
    }


    function pauseGame() {

        if (
            !game ||
            game.status !== "playing"
        ) {
            return;
        }

        game.status = "paused";

        stopAudio();

        updateGameUI();

        emitGameEvent(
            "portfolio:game-pause"
        );
    }


    function resumeGame() {

        if (
            !game ||
            game.status !== "paused"
        ) {
            return;
        }

        game.status = "playing";

        lastTime = now();

        ensureAudio();

        updateGameUI();

        startLoop();

        emitGameEvent(
            "portfolio:game-resume"
        );
    }


    function endGame() {

        if (!game) return;

        game.status = "gameover";

        game.stats.timePlayed =
            game.elapsed;

        const finalScore =
            Math.floor(game.score);

        if (
            finalScore >
            highScore
        ) {

            highScore =
                finalScore;

            saveHighScore(
                highScore
            );
        }

        stopAudio();

        updateGameUI();

        emitGameEvent(
            "portfolio:game-over",
            {
                score: finalScore,
                distance:
                    Math.floor(
                        game.distance
                    ),
                highScore
            }
        );
    }


    /* =====================================================
       MAIN LOOP
    ===================================================== */

    function startLoop() {

        if (animationFrame) {
            return;
        }

        lastTime = now();

        animationFrame =
            requestAnimationFrame(
                loop
            );
    }


    function stopLoop() {

        if (animationFrame) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = null;
        }
    }


    function loop(timestamp) {

        animationFrame = null;

        const delta =
            Math.min(
                0.05,
                Math.max(
                    0,
                    (timestamp - lastTime) /
                    1000
                )
            );

        lastTime =
            timestamp;

        if (
            game &&
            game.status ===
            "playing"
        ) {

            update(delta);
        }

        render();

        if (
            game &&
            (
                game.status === "playing" ||
                game.status === "paused" ||
                game.status === "menu"
            )
        ) {

            animationFrame =
                requestAnimationFrame(
                    loop
                );
        }
    }


    /* =====================================================
       UPDATE
    ===================================================== */

    function update(delta) {

        game.elapsed += delta;

        game.frame++;

        game.stats.timePlayed =
            game.elapsed;

        updateFPS(delta);

        updateDifficulty();

        updatePlayer(delta);

        updateSpeed(delta);

        updateWorld(delta);

        updateSpawning(delta);

        updateObstacles(delta);

        updateCollectibles(delta);

        updateParticles(delta);

        updateMessages(delta);

        updateCamera(delta);

        updateScore(delta);

        updateGameUI();
    }


    /* =====================================================
       DIFFICULTY
    ===================================================== */

    function updateDifficulty() {

        /*
         * Every ~20 seconds the world becomes more intense.
         */
        game.difficulty =
            1 +
            Math.floor(
                game.elapsed / 20
            ) * 0.18;

        game.level =
            Math.max(
                1,
                Math.floor(
                    game.elapsed / 30
                ) + 1
            );

        game.maxSpeed =
            Math.min(
                1.55,
                1.25 +
                game.difficulty * .025
            );
    }


    /* =====================================================
       PLAYER
    ===================================================== */

    function updatePlayer(delta) {

        let direction = 0;

        if (
            input.left ||
            touchControls.left
        ) {
            direction -= 1;
        }

        if (
            input.right ||
            touchControls.right
        ) {
            direction += 1;
        }

        /*
         * Pointer steering.
         */
        if (pointer.active) {

            const target =
                clamp(
                    pointer.x,
                    -1,
                    1
                );

            game.player.targetX =
                target;
        } else {

            game.player.targetX +=
                direction *
                delta *
                1.65;
        }

        game.player.targetX =
            clamp(
                game.player.targetX,
                -0.82,
                0.82
            );

        game.player.x =
            lerp(
                game.player.x,
                game.player.targetX,
                1 -
                Math.pow(
                    0.001,
                    delta
                )
            );

        game.player.tilt =
            lerp(
                game.player.tilt,
                direction * .12,
                .12
            );

        game.player.glow =
            lerp(
                game.player.glow,
                input.boost ||
                touchControls.boost
                    ? 1
                    : .35,
                .08
            );

        if (
            game.player.invulnerable >
            0
        ) {

            game.player.invulnerable -=
                delta;
        }

        /*
         * Boost consumes energy.
         */
        const boosting =
            input.boost ||
            touchControls.boost;

        if (
            boosting &&
            game.energy > 0
        ) {

            game.energy =
                clamp(
                    game.energy -
                    delta * 25,
                    0,
                    100
                );

            game.boosts +=
                delta;

        } else {

            game.energy =
                clamp(
                    game.energy +
                    delta * 7,
                    0,
                    100
                );
        }
    }


    /* =====================================================
       SPEED
    ===================================================== */

    function updateSpeed(delta) {

        const boosting =
            input.boost ||
            touchControls.boost;

        const target =
            boosting &&
            game.energy > 0
                ? game.maxSpeed * 1.28
                : game.baseSpeed +
                  game.difficulty * .018;

        game.speed =
            lerp(
                game.speed,
                clamp(
                    target,
                    .25,
                    1.75
                ),
                delta * 2.4
            );

        game.stats.bestSpeed =
            Math.max(
                game.stats.bestSpeed,
                game.speed
            );
    }


    /* =====================================================
       WORLD MOVEMENT
    ===================================================== */

    function updateWorld(delta) {

        game.worldOffset +=
            game.speed *
            delta;

        game.worldOffset %=
            1000;

        game.environment.forEach(
            object => {

                object.z +=
                    game.speed *
                    delta *
                    .42;

                if (
                    object.z > 1.15
                ) {

                    object.z =
                        random(
                            -0.15,
                            0
                        );

                    object.x =
                        random(
                            -1.2,
                            1.2
                        );
                }
            }
        );

        game.roadMarks.forEach(
            mark => {

                mark.z +=
                    game.speed *
                    delta *
                    .8;

                if (
                    mark.z > 1
                ) {

                    mark.z -= 1.1;

                    mark.lane =
                        randomInt(
                            -1,
                            1
                        );
                }
            }
        );
    }


    /* =====================================================
       SPAWNING
    ===================================================== */

    function updateSpawning(delta) {

        game.spawnTimer -=
            delta;

        game.collectibleTimer -=
            delta;

        const obstacleInterval =
            clamp(
                1.35 -
                game.difficulty * .035,
                .48,
                1.35
            );

        if (
            game.spawnTimer <= 0
        ) {

            spawnObstacle();

            game.spawnTimer =
                random(
                    obstacleInterval * .65,
                    obstacleInterval * 1.15
                );
        }

        if (
            game.collectibleTimer <= 0
        ) {

            spawnCollectible();

            game.collectibleTimer =
                random(
                    1.2,
                    2.7
                );
        }
    }


    function spawnObstacle() {

        const types = [
            "barrier",
            "block",
            "orb",
            "gate",
            "drone"
        ];

        const type =
            types[
                randomInt(
                    0,
                    types.length - 1
                )
            ];

        const lane =
            randomInt(
                -2,
                2
            );

        game.obstacles.push({

            type,

            x:
                lane * .32,

            z:
                -0.08,

            width:
                type === "gate"
                    ? .25
                    : random(
                        .12,
                        .22
                    ),

            height:
                random(
                    .08,
                    .18
                ),

            speed:
                random(
                    .82,
                    1.18
                ),

            rotation:
                random(
                    0,
                    Math.PI * 2
                ),

            rotationSpeed:
                random(
                    -1.5,
                    1.5
                ),

            passed: false,

            nearMissed: false,

            pulse:
                random(
                    0,
                    Math.PI * 2
                )
        });
    }


    function spawnCollectible() {

        const type =
            Math.random() < .18
                ? "energy"
                : "shard";

        game.collectibles.push({

            type,

            x:
                random(
                    -.78,
                    .78
                ),

            z:
                -0.05,

            size:
                random(
                    .035,
                    .065
                ),

            rotation:
                random(
                    0,
                    Math.PI * 2
                ),

            rotationSpeed:
                random(
                    -2,
                    2
                ),

            pulse:
                random(
                    0,
                    Math.PI * 2
                )
        });
    }


    /* =====================================================
       OBSTACLES
    ===================================================== */

    function updateObstacles(delta) {

        for (
            let i =
                game.obstacles.length - 1;
            i >= 0;
            i--
        ) {

            const obstacle =
                game.obstacles[i];

            obstacle.z +=
                game.speed *
                delta *
                obstacle.speed;

            obstacle.rotation +=
                obstacle.rotationSpeed *
                delta;

            obstacle.pulse +=
                delta * 3;

            if (
                !obstacle.passed &&
                obstacle.z > .74
            ) {

                obstacle.passed = true;

                game.passedObjects++;

                /*
                 * Near miss window.
                 */
                const dx =
                    Math.abs(
                        game.player.x -
                        obstacle.x
                    );

                if (
                    dx <
                    obstacle.width * 2.5 &&
                    dx >
                    obstacle.width
                ) {

                    triggerNearMiss();
                }
            }

            if (
                checkObstacleCollision(
                    obstacle
                )
            ) {

                damagePlayer(
                    obstacle
                );

                game.obstacles.splice(
                    i,
                    1
                );

                continue;
            }

            if (
                obstacle.z >
                1.12
            ) {

                game.obstacles.splice(
                    i,
                    1
                );
            }
        }
    }


    function checkObstacleCollision(
        obstacle
    ) {

        if (
            game.player.invulnerable >
            0
        ) {
            return false;
        }

        /*
         * Collision is only meaningful when
         * the object is close to the player.
         */
        if (
            obstacle.z < .67 ||
            obstacle.z > .93
        ) {
            return false;
        }

        const dx =
            Math.abs(
                game.player.x -
                obstacle.x
            );

        const collisionWidth =
            obstacle.width +
            game.player.width *
            .55;

        return (
            dx <
            collisionWidth
        );
    }


    function damagePlayer(
        obstacle
    ) {

        game.health =
            clamp(
                game.health - 22,
                0,
                100
            );

        game.player.invulnerable =
            1.1;

        game.combo = 0;
        game.comboTimer = 0;

        game.shake =
            Math.max(
                game.shake,
                13
            );

        game.flash =
            Math.max(
                game.flash,
                .7
            );

        createBurst(
            getPlayerScreenPosition(),
            22,
            "damage"
        );

        showMessage(
            "IMPACT",
            "damage"
        );

        playTone(
            90,
            .16,
            "sawtooth"
        );

        if (
            game.health <= 0
        ) {

            endGame();
        }
    }


    function triggerNearMiss() {

        game.nearMisses++;

        game.combo += 1;

        game.comboTimer = 2.8;

        game.stats.bestCombo =
            Math.max(
                game.stats.bestCombo,
                game.combo
            );

        game.score +=
            40 *
            Math.max(
                1,
                game.combo
            );

        game.shake =
            Math.max(
                game.shake,
                3
            );

        showMessage(
            "NEAR MISS +40",
            "success"
        );

        playTone(
            580,
            .07,
            "sine"
        );
    }


    /* =====================================================
       COLLECTIBLES
    ===================================================== */

    function updateCollectibles(delta) {

        for (
            let i =
                game.collectibles.length - 1;
            i >= 0;
            i--
        ) {

            const item =
                game.collectibles[i];

            item.z +=
                game.speed *
                delta *
                .95;

            item.rotation +=
                item.rotationSpeed *
                delta;

            item.pulse +=
                delta * 4;

            if (
                checkCollectibleCollision(
                    item
                )
            ) {

                collectItem(item);

                game.collectibles.splice(
                    i,
                    1
                );

                continue;
            }

            if (
                item.z > 1.15
            ) {

                game.collectibles.splice(
                    i,
                    1
                );
            }
        }
    }


    function checkCollectibleCollision(
        item
    ) {

        if (
            item.z < .65 ||
            item.z > .94
        ) {
            return false;
        }

        const dx =
            Math.abs(
                game.player.x -
                item.x
            );

        return (
            dx <
            .13
        );
    }


    function collectItem(item) {

        game.collected++;

        game.combo += 1;

        game.comboTimer =
            3.2;

        game.stats.bestCombo =
            Math.max(
                game.stats.bestCombo,
                game.combo
            );

        if (
            item.type ===
            "energy"
        ) {

            game.energy =
                clamp(
                    game.energy + 30,
                    0,
                    100
                );

            game.score +=
                120 *
                Math.max(
                    1,
                    game.combo
                );

            showMessage(
                "ENERGY +30",
                "energy"
            );

            playTone(
                720,
                .08,
                "sine"
            );

        } else {

            game.score +=
                75 *
                Math.max(
                    1,
                    game.combo
                );

            showMessage(
                `SHARD +${75 * Math.max(1, game.combo)}`,
                "success"
            );

            playTone(
                480,
                .06,
                "triangle"
            );
        }

        createBurst(
            getWorldScreenPosition(
                item.x,
                item.z
            ),
            14,
            item.type
        );
    }


    /* =====================================================
       COMBO / SCORE
    ===================================================== */

    function updateScore(delta) {

        const distanceGain =
            game.speed *
            delta *
            65;

        game.distance +=
            distanceGain;

        game.score +=
            distanceGain *
            .7 *
            Math.max(
                1,
                1 +
                game.combo *
                .025
            );

        if (
            game.comboTimer > 0
        ) {

            game.comboTimer -=
                delta;

            if (
                game.comboTimer <= 0
            ) {

                game.combo = 0;
            }
        }
    }


    /* =====================================================
       PARTICLES
    ===================================================== */

    function createBurst(
        position,
        count,
        type = "default"
    ) {

        const colors = {
            default: 1,
            damage: 2,
            success: 3,
            energy: 4
        };

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const angle =
                random(
                    0,
                    Math.PI * 2
                );

            const velocity =
                random(
                    30,
                    180
                );

            game.particles.push({

                x:
                    position.x,

                y:
                    position.y,

                vx:
                    Math.cos(angle) *
                    velocity,

                vy:
                    Math.sin(angle) *
                    velocity,

                life:
                    random(
                        .35,
                        .85
                    ),

                maxLife:
                    .85,

                size:
                    random(
                        1,
                        4
                    ),

                type:
                    colors[type] ||
                    1
            });
        }
    }


    function updateParticles(delta) {

        for (
            let i =
                game.particles.length - 1;
            i >= 0;
            i--
        ) {

            const particle =
                game.particles[i];

            particle.x +=
                particle.vx *
                delta;

            particle.y +=
                particle.vy *
                delta;

            particle.vy +=
                45 *
                delta;

            particle.life -=
                delta;

            if (
                particle.life <= 0
            ) {

                game.particles.splice(
                    i,
                    1
                );
            }
        }

        /*
         * Prevent runaway particle counts on slow devices.
         */
        const maxParticles =
            game.quality === "low"
                ? 90
                : game.quality === "medium"
                    ? 160
                    : 260;

        if (
            game.particles.length >
            maxParticles
        ) {

            game.particles.splice(
                0,
                game.particles.length -
                maxParticles
            );
        }
    }


    /* =====================================================
       MESSAGES
    ===================================================== */

    function showMessage(
        text,
        type = "default"
    ) {

        game.messages.push({

            text,

            type,

            life: 1.25,

            maxLife: 1.25,

            x:
                canvas._logicalWidth /
                2,

            y:
                canvas._logicalHeight *
                .23 +

                random(
                    -15,
                    15
                )
        });
    }


    function updateMessages(delta) {

        game.messages.forEach(
            message => {

                message.life -=
                    delta;

                message.y -=
                    delta * 15;
            }
        );

        game.messages =
            game.messages.filter(
                message =>
                    message.life > 0
            );
    }


    /* =====================================================
       CAMERA
    ===================================================== */

    function updateCamera(delta) {

        if (
            game.shake > 0
        ) {

            game.shake =
                Math.max(
                    0,
                    game.shake -
                    delta * 22
                );

            game.camera.shakeX =
                random(
                    -game.shake,
                    game.shake
                );

            game.camera.shakeY =
                random(
                    -game.shake,
                    game.shake
                );

        } else {

            game.camera.shakeX = 0;
            game.camera.shakeY = 0;
        }

        if (
            game.flash > 0
        ) {

            game.flash =
                Math.max(
                    0,
                    game.flash -
                    delta * 2.8
                );
        }
    }


    /* =====================================================
       FPS / ADAPTIVE QUALITY
    ===================================================== */

    function updateFPS(delta) {

        if (
            delta <= 0
        ) {
            return;
        }

        const fps =
            1 / delta;

        game.fpsSamples.push(
            fps
        );

        if (
            game.fpsSamples.length >
            30
        ) {
            game.fpsSamples.shift();
        }

        if (
            game.elapsed -
            game.lastFpsUpdate >
            2
        ) {

            game.lastFpsUpdate =
                game.elapsed;

            const average =
                game.fpsSamples.reduce(
                    (sum, value) =>
                        sum + value,
                    0
                ) /
                game.fpsSamples.length;

            game.fps =
                clamp(
                    average,
                    1,
                    120
                );

            adaptQuality();
        }
    }


    function adaptQuality() {

        if (
            game.fps < 35 &&
            game.quality !== "low"
        ) {

            game.quality =
                "low";

            return;
        }

        if (
            game.fps < 48 &&
            game.quality === "high"
        ) {

            game.quality =
                "medium";

            return;
        }

        /*
         * Don't automatically increase quality.
         * Stability is more important than visual excess.
         */
    }


    /* =====================================================
       RENDER PIPELINE
    ===================================================== */

    function render() {

        if (
            !canvas ||
            !ctx
        ) {
            return;
        }

        const width =
            canvas._logicalWidth ||
            canvas.clientWidth ||
            960;

        const height =
            canvas._logicalHeight ||
            canvas.clientHeight ||
            540;

        ctx.save();

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        ctx.translate(
            game?.camera.shakeX || 0,
            game?.camera.shakeY || 0
        );

        renderSky(
            width,
            height
        );

        renderStars(
            width,
            height
        );

        renderHorizon(
            width,
            height
        );

        renderEnvironment(
            width,
            height
        );

        renderRoad(
            width,
            height
        );

        renderRoadMarks(
            width,
            height
        );

        renderCollectibles(
            width,
            height
        );

        renderObstacles(
            width,
            height
        );

        renderPlayer(
            width,
            height
        );

        renderParticles();

        renderMessages(
            width,
            height
        );

        renderHUD(
            width,
            height
        );

        renderOverlay(
            width,
            height
        );

        if (
            game?.flash > 0
        ) {

            ctx.fillStyle =
                `rgba(255,255,255,${
                    game.flash * .16
                })`;

            ctx.fillRect(
                0,
                0,
                width,
                height
            );
        }

        ctx.restore();
    }


    /* =====================================================
       SKY
    ===================================================== */

    function renderSky(
        width,
        height
    ) {

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                height
            );

        gradient.addColorStop(
            0,
            "#03040b"
        );

        gradient.addColorStop(
            .42,
            "#080b18"
        );

        gradient.addColorStop(
            1,
            "#11131b"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        /*
         * Atmospheric moon / light source.
         */
        const moonX =
            width * .76;

        const moonY =
            height * .18;

        const radius =
            Math.min(
                width,
                height
            ) * .075;

        const moonGradient =
            ctx.createRadialGradient(
                moonX,
                moonY,
                radius * .1,
                moonX,
                moonY,
                radius * 2.6
            );

        moonGradient.addColorStop(
            0,
            "rgba(255,255,255,.20)"
        );

        moonGradient.addColorStop(
            .25,
            "rgba(255,255,255,.08)"
        );

        moonGradient.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        ctx.fillStyle =
            moonGradient;

        ctx.fillRect(
            moonX - radius * 3,
            moonY - radius * 3,
            radius * 6,
            radius * 6
        );

        ctx.beginPath();

        ctx.arc(
            moonX,
            moonY,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(245,245,250,.86)";

        ctx.fill();
    }


    /* =====================================================
       STARS
    ===================================================== */

    function renderStars(
        width,
        height
    ) {

        if (!game) return;

        game.stars.forEach(
            star => {

                const x =
                    star.x *
                    width;

                const y =
                    star.y *
                    height;

                const twinkle =
                    .45 +
                    Math.sin(
                        game.elapsed * 2 +
                        star.twinkle
                    ) *
                    .25;

                ctx.globalAlpha =
                    clamp(
                        twinkle *
                        star.depth,
                        .08,
                        .9
                    );

                ctx.fillStyle =
                    "#ffffff";

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    star.size,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }
        );

        ctx.globalAlpha = 1;
    }


    /* =====================================================
       HORIZON
    ===================================================== */

    function renderHorizon(
        width,
        height
    ) {

        const horizon =
            height *
            game.camera.horizon;

        const gradient =
            ctx.createLinearGradient(
                0,
                horizon,
                0,
                height
            );

        gradient.addColorStop(
            0,
            "rgba(255,255,255,.035)"
        );

        gradient.addColorStop(
            .4,
            "rgba(255,255,255,.015)"
        );

        gradient.addColorStop(
            1,
            "rgba(0,0,0,.25)"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            horizon,
            width,
            height - horizon
        );
    }


    /* =====================================================
       ENVIRONMENT
    ===================================================== */

    function renderEnvironment(
        width,
        height
    ) {

        const horizon =
            height *
            game.camera.horizon;

        game.environment
            .slice()
            .sort(
                (a, b) =>
                    a.z - b.z
            )
            .forEach(
                object => {

                    if (
                        object.z < 0 ||
                        object.z > 1
                    ) {
                        return;
                    }

                    const scale =
                        projectScale(
                            object.z
                        );

                    const x =
                        width / 2 +
                        object.x *
                        width *
                        .48 *
                        scale;

                    const y =
                        horizon +
                        (
                            height -
                            horizon
                        ) *
                        object.z;

                    const size =
                        scale *
                        object.scale *
                        110;

                    drawEnvironmentObject(
                        object,
                        x,
                        y,
                        size
                    );
                }
            );
    }


    function drawEnvironmentObject(
        object,
        x,
        y,
        size
    ) {

        ctx.save();

        ctx.globalAlpha =
            clamp(
                object.brightness *
                .85,
                .12,
                .9
            );

        ctx.translate(
            x,
            y
        );

        ctx.rotate(
            object.rotation
        );

        switch (
            object.type
        ) {

            case "pillar":

                ctx.fillStyle =
                    "rgba(190,195,210,.10)";

                ctx.fillRect(
                    -size * .08,
                    -size,
                    size * .16,
                    size
                );

                ctx.strokeStyle =
                    "rgba(255,255,255,.18)";

                ctx.strokeRect(
                    -size * .08,
                    -size,
                    size * .16,
                    size
                );

                break;


            case "tree":

                ctx.fillStyle =
                    "rgba(20,30,35,.85)";

                ctx.beginPath();

                ctx.moveTo(
                    0,
                    -size
                );

                ctx.lineTo(
                    -size * .35,
                    0
                );

                ctx.lineTo(
                    size * .35,
                    0
                );

                ctx.closePath();

                ctx.fill();

                ctx.fillRect(
                    -size * .04,
                    0,
                    size * .08,
                    size * .35
                );

                break;


            case "light":

                ctx.fillStyle =
                    "rgba(255,255,255,.55)";

                ctx.fillRect(
                    -size * .025,
                    -size,
                    size * .05,
                    size
                );

                ctx.shadowBlur =
                    size * .18;

                ctx.shadowColor =
                    "rgba(255,255,255,.7)";

                ctx.beginPath();

                ctx.arc(
                    0,
                    -size,
                    size * .055,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                ctx.shadowBlur = 0;

                break;


            case "building":

                ctx.fillStyle =
                    "rgba(15,18,26,.95)";

                ctx.fillRect(
                    -size * .28,
                    -size,
                    size * .56,
                    size
                );

                ctx.strokeStyle =
                    "rgba(255,255,255,.09)";

                ctx.strokeRect(
                    -size * .28,
                    -size,
                    size * .56,
                    size
                );

                break;


            case "crystal":

                ctx.fillStyle =
                    "rgba(225,230,240,.12)";

                ctx.strokeStyle =
                    "rgba(255,255,255,.25)";

                ctx.beginPath();

                ctx.moveTo(
                    0,
                    -size
                );

                ctx.lineTo(
                    size * .18,
                    -size * .25
                );

                ctx.lineTo(
                    0,
                    0
                );

                ctx.lineTo(
                    -size * .18,
                    -size * .25
                );

                ctx.closePath();

                ctx.fill();
                ctx.stroke();

                break;


            case "sign":

                ctx.strokeStyle =
                    "rgba(255,255,255,.22)";

                ctx.lineWidth =
                    Math.max(
                        1,
                        size * .018
                    );

                ctx.beginPath();

                ctx.moveTo(
                    0,
                    0
                );

                ctx.lineTo(
                    0,
                    -size * .75
                );

                ctx.stroke();

                ctx.strokeRect(
                    -size * .28,
                    -size,
                    size * .56,
                    size * .24
                );

                break;
        }

        ctx.restore();
    }


    /* =====================================================
       ROAD
    ===================================================== */

    function renderRoad(
        width,
        height
    ) {

        const horizon =
            height *
            game.camera.horizon;

        const roadBottom =
            width *
            .88;

        const roadTop =
            width *
            .12;

        /*
         * Outer landscape.
         */
        ctx.fillStyle =
            "#080b10";

        ctx.beginPath();

        ctx.moveTo(
            0,
            horizon
        );

        ctx.lineTo(
            width,
            horizon
        );

        ctx.lineTo(
            width,
            height
        );

        ctx.lineTo(
            0,
            height
        );

        ctx.closePath();

        ctx.fill();

        /*
         * Main road.
         */
        ctx.beginPath();

        ctx.moveTo(
            width / 2 - roadTop / 2,
            horizon
        );

        ctx.lineTo(
            width / 2 + roadTop / 2,
            horizon
        );

        ctx.lineTo(
            width / 2 + roadBottom / 2,
            height
        );

        ctx.lineTo(
            width / 2 - roadBottom / 2,
            height
        );

        ctx.closePath();

        const roadGradient =
            ctx.createLinearGradient(
                0,
                horizon,
                0,
                height
            );

        roadGradient.addColorStop(
            0,
            "#10131b"
        );

        roadGradient.addColorStop(
            1,
            "#1a1c22"
        );

        ctx.fillStyle =
            roadGradient;

        ctx.fill();

        /*
         * Road edges.
         */
        ctx.strokeStyle =
            "rgba(255,255,255,.14)";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            width / 2 - roadTop / 2,
            horizon
        );

        ctx.lineTo(
            width / 2 - roadBottom / 2,
            height
        );

        ctx.moveTo(
            width / 2 + roadTop / 2,
            horizon
        );

        ctx.lineTo(
            width / 2 + roadBottom / 2,
            height
        );

        ctx.stroke();

        /*
         * Subtle road grid.
         */
        ctx.strokeStyle =
            "rgba(255,255,255,.025)";

        for (
            let i = 0;
            i < 14;
            i++
        ) {

            const z =
                i / 14;

            const y =
                projectY(
                    z,
                    height
                );

            const halfWidth =
                lerp(
                    roadTop / 2,
                    roadBottom / 2,
                    z
                );

            ctx.beginPath();

            ctx.moveTo(
                width / 2 -
                halfWidth,
                y
            );

            ctx.lineTo(
                width / 2 +
                halfWidth,
                y
            );

            ctx.stroke();
        }
    }


    /* =====================================================
       ROAD MARKS
    ===================================================== */

    function renderRoadMarks(
        width,
        height
    ) {

        game.roadMarks.forEach(
            mark => {

                if (
                    mark.z < 0 ||
                    mark.z > 1
                ) {
                    return;
                }

                const y =
                    projectY(
                        mark.z,
                        height
                    );

                const scale =
                    projectScale(
                        mark.z
                    );

                const roadWidth =
                    lerp(
                        width * .12,
                        width * .88,
                        mark.z
                    );

                const x =
                    width / 2 +
                    mark.lane *
                    roadWidth *
                    .16;

                const markWidth =
                    Math.max(
                        1,
                        scale *
                        width *
                        .012
                    );

                const markHeight =
                    Math.max(
                        2,
                        scale *
                        30
                    );

                ctx.fillStyle =
                    "rgba(255,255,255,.12)";

                ctx.fillRect(
                    x - markWidth / 2,
                    y,
                    markWidth,
                    markHeight
                );
            }
        );
    }


    /* =====================================================
       PROJECTION
    ===================================================== */

    function projectScale(z) {

        /*
         * Objects at z=0 are far away.
         * Objects at z=1 are near.
         */
        return clamp(
            Math.pow(
                z,
                1.7
            ),
            .035,
            1
        );
    }


    function projectY(
        z,
        height
    ) {

        const horizon =
            height *
            game.camera.horizon;

        return lerp(
            horizon,
            height,
            Math.pow(
                z,
                1.35
            )
        );
    }


    function getWorldScreenPosition(
        x,
        z
    ) {

        const width =
            canvas._logicalWidth;

        const height =
            canvas._logicalHeight;

        const scale =
            projectScale(z);

        return {

            x:
                width / 2 +
                x *
                width *
                .48 *
                scale,

            y:
                projectY(
                    z,
                    height
                )
        };
    }


    /* =====================================================
       COLLECTIBLES RENDER
    ===================================================== */

    function renderCollectibles(
        width,
        height
    ) {

        game.collectibles
            .slice()
            .sort(
                (a, b) =>
                    a.z - b.z
            )
            .forEach(
                item => {

                    if (
                        item.z < 0 ||
                        item.z > 1
                    ) {
                        return;
                    }

                    const position =
                        getWorldScreenPosition(
                            item.x,
                            item.z
                        );

                    const scale =
                        projectScale(
                            item.z
                        );

                    const size =
                        item.size *
                        width *
                        scale *
                        2.4;

                    drawCollectible(
                        item,
                        position.x,
                        position.y -
                            size * 2,
                        size
                    );
                }
            );
    }


    function drawCollectible(
        item,
        x,
        y,
        size
    ) {

        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.rotate(
            item.rotation
        );

        const glow =
            .5 +
            Math.sin(
                item.pulse
            ) *
            .2;

        ctx.shadowBlur =
            size *
            4;

        ctx.shadowColor =
            `rgba(255,255,255,${glow})`;

        ctx.fillStyle =
            "rgba(245,245,250,.85)";

        ctx.strokeStyle =
            "rgba(255,255,255,.7)";

        ctx.lineWidth =
            Math.max(
                1,
                size * .08
            );

        if (
            item.type ===
            "energy"
        ) {

            ctx.beginPath();

            ctx.moveTo(
                0,
                -size
            );

            ctx.lineTo(
                size,
                0
            );

            ctx.lineTo(
                0,
                size
            );

            ctx.lineTo(
                -size,
                0
            );

            ctx.closePath();

            ctx.fill();
            ctx.stroke();

        } else {

            ctx.beginPath();

            ctx.moveTo(
                0,
                -size
            );

            ctx.lineTo(
                size * .75,
                0
            );

            ctx.lineTo(
                0,
                size
            );

            ctx.lineTo(
                -size * .75,
                0
            );

            ctx.closePath();

            ctx.fill();
            ctx.stroke();
        }

        ctx.restore();
    }


    /* =====================================================
       OBSTACLE RENDER
    ===================================================== */

    function renderObstacles(
        width,
        height
    ) {

        game.obstacles
            .slice()
            .sort(
                (a, b) =>
                    a.z - b.z
            )
            .forEach(
                obstacle => {

                    if (
                        obstacle.z < 0 ||
                        obstacle.z > 1
                    ) {
                        return;
                    }

                    const position =
                        getWorldScreenPosition(
                            obstacle.x,
                            obstacle.z
                        );

                    const scale =
                        projectScale(
                            obstacle.z
                        );

                    const size =
                        width *
                        scale *
                        .12;

                    drawObstacle(
                        obstacle,
                        position.x,
                        position.y,
                        size
                    );
                }
            );
    }


    function drawObstacle(
        obstacle,
        x,
        y,
        size
    ) {

        ctx.save();

        ctx.translate(
            x,
            y -
            size *
            .55
        );

        ctx.rotate(
            obstacle.rotation
        );

        const pulse =
            .55 +
            Math.sin(
                obstacle.pulse
            ) *
            .2;

        ctx.shadowBlur =
            size *
            .35;

        ctx.shadowColor =
            `rgba(255,255,255,${pulse})`;

        ctx.fillStyle =
            "rgba(22,25,32,.96)";

        ctx.strokeStyle =
            "rgba(255,255,255,.36)";

        ctx.lineWidth =
            Math.max(
                1,
                size * .035
            );

        switch (
            obstacle.type
        ) {

            case "barrier":

                ctx.fillRect(
                    -size,
                    -size * .45,
                    size * 2,
                    size * .9
                );

                ctx.strokeRect(
                    -size,
                    -size * .45,
                    size * 2,
                    size * .9
                );

                break;


            case "block":

                ctx.fillRect(
                    -size * .7,
                    -size * .7,
                    size * 1.4,
                    size * 1.4
                );

                ctx.strokeRect(
                    -size * .7,
                    -size * .7,
                    size * 1.4,
                    size * 1.4
                );

                break;


            case "orb":

                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    size * .62,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
                ctx.stroke();

                break;


            case "gate":

                ctx.strokeStyle =
                    "rgba(255,255,255,.42)";

                ctx.lineWidth =
                    Math.max(
                        2,
                        size * .1
                    );

                ctx.strokeRect(
                    -size,
                    -size,
                    size * 2,
                    size * 1.3
                );

                break;


            case "drone":

                ctx.beginPath();

                ctx.moveTo(
                    0,
                    -size
                );

                ctx.lineTo(
                    size,
                    0
                );

                ctx.lineTo(
                    0,
                    size
                );

                ctx.lineTo(
                    -size,
                    0
                );

                ctx.closePath();

                ctx.fill();
                ctx.stroke();

                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    size * .22,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    "rgba(255,255,255,.75)";

                ctx.fill();

                break;
        }

        ctx.restore();
    }


    /* =====================================================
       PLAYER
    ===================================================== */

    function renderPlayer(
        width,
        height
    ) {

        const x =
            width / 2 +
            game.player.x *
            width *
            .39;

        const y =
            height *
            .82;

        const size =
            Math.min(
                width,
                height
            ) *
            .13;

        const boosting =
            input.boost ||
            touchControls.boost;

        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.rotate(
            game.player.tilt
        );

        /*
         * Shadow.
         */
        ctx.fillStyle =
            "rgba(0,0,0,.38)";

        ctx.beginPath();

        ctx.ellipse(
            0,
            size * .52,
            size * .8,
            size * .18,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        /*
         * Player glow.
         */
        ctx.shadowBlur =
            boosting
                ? size * 1.2
                : size * .55;

        ctx.shadowColor =
            "rgba(255,255,255,.65)";

        /*
         * Body.
         */
        ctx.fillStyle =
            "rgba(215,218,225,.92)";

        ctx.strokeStyle =
            "rgba(255,255,255,.8)";

        ctx.lineWidth =
            Math.max(
                1,
                size * .025
            );

        ctx.beginPath();

        ctx.moveTo(
            0,
            -size * .95
        );

        ctx.lineTo(
            size * .6,
            size * .55
        );

        ctx.lineTo(
            0,
            size * .35
        );

        ctx.lineTo(
            -size * .6,
            size * .55
        );

        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        /*
         * Central glass core.
         */
        ctx.fillStyle =
            "rgba(30,34,44,.9)";

        ctx.beginPath();

        ctx.moveTo(
            0,
            -size * .65
        );

        ctx.lineTo(
            size * .27,
            size * .15
        );

        ctx.lineTo(
            0,
            size * .08
        );

        ctx.lineTo(
            -size * .27,
            size * .15
        );

        ctx.closePath();

        ctx.fill();

        /*
         * Boost trail.
         */
        if (boosting) {

            ctx.globalAlpha =
                .8;

            const gradient =
                ctx.createLinearGradient(
                    0,
                    size * .2,
                    0,
                    size * 1.8
                );

            gradient.addColorStop(
                0,
                "rgba(255,255,255,.65)"
            );

            gradient.addColorStop(
                1,
                "rgba(255,255,255,0)"
            );

            ctx.fillStyle =
                gradient;

            ctx.beginPath();

            ctx.moveTo(
                -size * .18,
                size * .25
            );

            ctx.lineTo(
                0,
                size * 1.7
            );

            ctx.lineTo(
                size * .18,
                size * .25
            );

            ctx.closePath();

            ctx.fill();
        }

        ctx.restore();

        /*
         * Invulnerability blink.
         */
        if (
            game.player.invulnerable >
            0
        ) {

            if (
                Math.floor(
                    game.player.invulnerable *
                    12
                ) % 2 === 0
            ) {

                ctx.strokeStyle =
                    "rgba(255,255,255,.75)";

                ctx.lineWidth = 2;

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    size * .8,
                    0,
                    Math.PI * 2
                );

                ctx.stroke();
            }
        }
    }


    function getPlayerScreenPosition() {

        return {

            x:
                (
                    canvas._logicalWidth /
                    2
                ) +
                game.player.x *
                canvas._logicalWidth *
                .39,

            y:
                canvas._logicalHeight *
                .82
        };
    }


    /* =====================================================
       PARTICLE RENDER
    ===================================================== */

    function renderParticles() {

        game.particles.forEach(
            particle => {

                const alpha =
                    clamp(
                        particle.life /
                        particle.maxLife,
                        0,
                        1
                    );

                ctx.globalAlpha =
                    alpha;

                ctx.fillStyle =
                    "#ffffff";

                ctx.beginPath();

                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.size,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }
        );

        ctx.globalAlpha = 1;
    }


    /* =====================================================
       FLOATING MESSAGES
    ===================================================== */

    function renderMessages(
        width,
        height
    ) {

        game.messages.forEach(
            message => {

                const alpha =
                    clamp(
                        message.life /
                        message.maxLife,
                        0,
                        1
                    );

                ctx.save();

                ctx.globalAlpha =
                    alpha;

                ctx.textAlign =
                    "center";

                ctx.font =
                    "700 13px Inter, Arial, sans-serif";

                ctx.fillStyle =
                    "#ffffff";

                ctx.fillText(
                    message.text,
                    message.x,
                    message.y
                );

                ctx.restore();
            }
        );
    }


    /* =====================================================
       HUD
    ===================================================== */

    function renderHUD(
        width,
        height
    ) {

        if (
            !game ||
            game.status ===
            "menu"
        ) {
            return;
        }

        ctx.save();

        /*
         * Top left.
         */
        ctx.textAlign =
            "left";

        ctx.fillStyle =
            "rgba(255,255,255,.82)";

        ctx.font =
            "700 13px Inter, Arial, sans-serif";

        ctx.fillText(
            "SCORE",
            20,
            26
        );

        ctx.font =
            "700 24px Inter, Arial, sans-serif";

        ctx.fillText(
            Math.floor(
                game.score
            ).toLocaleString(),
            20,
            51
        );

        /*
         * Distance.
         */
        ctx.font =
            "500 11px Inter, Arial, sans-serif";

        ctx.fillStyle =
            "rgba(255,255,255,.48)";

        ctx.fillText(
            `${Math.floor(
                game.distance
            )} m`,
            21,
            69
        );

        /*
         * Top right.
         */
        ctx.textAlign =
            "right";

        ctx.fillStyle =
            "rgba(255,255,255,.55)";

        ctx.font =
            "600 11px Inter, Arial, sans-serif";

        ctx.fillText(
            `LEVEL ${game.level}`,
            width - 20,
            25
        );

        ctx.fillText(
            `BEST ${Math.floor(
                highScore
            ).toLocaleString()}`,
            width - 20,
            42
        );

        /*
         * Health.
         */
        drawBar(
            20,
            height - 40,
            120,
            7,
            game.health / 100,
            "rgba(255,255,255,.65)",
            "HEALTH"
        );

        /*
         * Energy.
         */
        drawBar(
            width - 140,
            height - 40,
            120,
            7,
            game.energy / 100,
            "rgba(255,255,255,.45)",
            "ENERGY"
        );

        /*
         * Combo.
         */
        if (
            game.combo > 1
        ) {

            ctx.textAlign =
                "center";

            ctx.font =
                "700 16px Inter, Arial, sans-serif";

            ctx.fillStyle =
                "rgba(255,255,255,.82)";

            ctx.fillText(
                `COMBO ×${game.combo}`,
                width / 2,
                36
            );
        }

        ctx.restore();
    }


    function drawBar(
        x,
        y,
        width,
        height,
        value,
        fill,
        label
    ) {

        ctx.fillStyle =
            "rgba(255,255,255,.07)";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        ctx.fillStyle =
            fill;

        ctx.fillRect(
            x,
            y,
            width * clamp(
                value,
                0,
                1
            ),
            height
        );

        ctx.font =
            "600 8px Inter, Arial, sans-serif";

        ctx.fillStyle =
            "rgba(255,255,255,.42)";

        ctx.textAlign =
            "left";

        ctx.fillText(
            label,
            x,
            y - 5
        );
    }


    /* =====================================================
       OVERLAY
    ===================================================== */

    function renderOverlay(
        width,
        height
    ) {

        if (!game) return;

        if (
            game.status ===
            "menu"
        ) {

            drawCenterOverlay(
                width,
                height,
                "NOCLIP",
                "A PORTFOLIO GAME",
                "PRESS ENTER / TAP TO START"
            );

            return;
        }

        if (
            game.status ===
            "paused"
        ) {

            drawCenterOverlay(
                width,
                height,
                "PAUSED",
                "THE WORLD IS WAITING",
                "PRESS P / TAP PAUSE TO RESUME"
            );

            return;
        }

        if (
            game.status ===
            "gameover"
        ) {

            drawCenterOverlay(
                width,
                height,
                "RUN ENDED",
                `SCORE ${Math.floor(
                    game.score
                ).toLocaleString()}`,
                `BEST ${Math.floor(
                    highScore
                ).toLocaleString()}  ·  PRESS R TO RESTART`
            );
        }
    }


    function drawCenterOverlay(
        width,
        height,
        title,
        subtitle,
        instruction
    ) {

        ctx.save();

        ctx.fillStyle =
            "rgba(0,0,0,.28)";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        ctx.textAlign =
            "center";

        ctx.fillStyle =
            "rgba(255,255,255,.95)";

        ctx.font =
            "800 38px Inter, Arial, sans-serif";

        ctx.fillText(
            title,
            width / 2,
            height * .42
        );

        ctx.font =
            "500 12px Inter, Arial, sans-serif";

        ctx.fillStyle =
            "rgba(255,255,255,.52)";

        ctx.fillText(
            subtitle,
            width / 2,
            height * .48
        );

        ctx.font =
            "600 10px Inter, Arial, sans-serif";

        ctx.fillStyle =
            "rgba(255,255,255,.75)";

        ctx.fillText(
            instruction,
            width / 2,
            height * .56
        );

        ctx.restore();
    }


    /* =====================================================
       INPUT — KEYBOARD
    ===================================================== */

    function setupKeyboard() {

        doc.addEventListener(
            "keydown",
            event => {

                switch (
                    event.key.toLowerCase()
                ) {

                    case "arrowleft":
                    case "a":
                        input.left = true;
                        break;

                    case "arrowright":
                    case "d":
                        input.right = true;
                        break;

                    case "arrowup":
                    case "w":
                        input.up = true;
                        break;

                    case "arrowdown":
                    case "s":
                        input.down = true;
                        break;

                    case "shift":
                        input.boost = true;
                        break;

                    case "p":

                        if (
                            game?.status ===
                            "playing"
                        ) {
                            pauseGame();

                        } else if (
                            game?.status ===
                            "paused"
                        ) {
                            resumeGame();
                        }

                        break;

                    case "r":

                        if (
                            game?.status ===
                            "gameover"
                        ) {
                            startGame();
                        }

                        break;

                    case "enter":

                        if (
                            game?.status ===
                            "menu" ||
                            game?.status ===
                            "gameover"
                        ) {
                            startGame();
                        }

                        break;
                }
            }
        );


        doc.addEventListener(
            "keyup",
            event => {

                switch (
                    event.key.toLowerCase()
                ) {

                    case "arrowleft":
                    case "a":
                        input.left = false;
                        break;

                    case "arrowright":
                    case "d":
                        input.right = false;
                        break;

                    case "arrowup":
                    case "w":
                        input.up = false;
                        break;

                    case "arrowdown":
                    case "s":
                        input.down = false;
                        break;

                    case "shift":
                        input.boost = false;
                        break;
                }
            }
        );
    }


    /* =====================================================
       POINTER CONTROL
    ===================================================== */

    function setupPointerControls() {

        if (!canvas) return;

        canvas.addEventListener(
            "pointermove",
            event => {

                if (
                    game?.status !==
                    "playing"
                ) {
                    return;
                }

                const rect =
                    canvas.getBoundingClientRect();

                const x =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width;

                pointer.x =
                    clamp(
                        (
                            x -
                            .5
                        ) *
                        2,
                        -1,
                        1
                    );
            },
            {
                passive: true
            }
        );

        canvas.addEventListener(
            "pointerenter",
            () => {
                pointer.active = true;
            }
        );

        canvas.addEventListener(
            "pointerleave",
            () => {
                pointer.active = false;
            }
        );
    }


    /* =====================================================
       TOUCH CONTROLS
    ===================================================== */

    function setupTouchControls() {

        if (!canvas) return;

        let startX = 0;
        let startY = 0;

        canvas.addEventListener(
            "touchstart",
            event => {

                const touch =
                    event.touches[0];

                if (!touch) return;

                startX =
                    touch.clientX;

                startY =
                    touch.clientY;

                pointer.active = true;

                event.preventDefault();

            },
            {
                passive: false
            }
        );

        canvas.addEventListener(
            "touchmove",
            event => {

                const touch =
                    event.touches[0];

                if (!touch) return;

                const dx =
                    touch.clientX -
                    startX;

                const width =
                    canvas.clientWidth ||
                    1;

                game.player.targetX +=
                    (
                        dx /
                        width
                    ) *
                    1.8;

                game.player.targetX =
                    clamp(
                        game.player.targetX,
                        -.82,
                        .82
                    );

                startX =
                    touch.clientX;

                event.preventDefault();

            },
            {
                passive: false
            }
        );

        canvas.addEventListener(
            "touchend",
            event => {

                pointer.active = false;

                /*
                 * Tap when not playing starts the game.
                 */
                if (
                    game?.status ===
                    "menu" ||
                    game?.status ===
                    "gameover"
                ) {

                    startGame();
                }

                event.preventDefault();

            },
            {
                passive: false
            }
        );
    }


    /* =====================================================
       UI CONTROLS
    ===================================================== */

    function findControl(
        names
    ) {

        for (
            const selector of names
        ) {

            const element =
                $(selector);

            if (element) {
                return element;
            }
        }

        return null;
    }


    function setupUIControls() {

        const start =
            findControl([
                "#gameStart",
                "#game-start",
                "[data-game-start]"
            ]);

        const pause =
            findControl([
                "#gamePause",
                "#game-pause",
                "[data-game-pause]"
            ]);

        const restart =
            findControl([
                "#gameRestart",
                "#game-restart",
                "[data-game-restart]"
            ]);

        const left =
            findControl([
                "#gameLeft",
                "#game-left",
                "[data-game-left]"
            ]);

        const right =
            findControl([
                "#gameRight",
                "#game-right",
                "[data-game-right]"
            ]);

        const boost =
            findControl([
                "#gameBoost",
                "#game-boost",
                "[data-game-boost]"
            ]);


        if (start) {

            start.addEventListener(
                "click",
                startGame
            );
        }

        if (pause) {

            pause.addEventListener(
                "click",
                () => {

                    if (
                        game?.status ===
                        "playing"
                    ) {
                        pauseGame();
                    } else if (
                        game?.status ===
                        "paused"
                    ) {
                        resumeGame();
                    }
                }
            );
        }

        if (restart) {

            restart.addEventListener(
                "click",
                startGame
            );
        }


        bindHoldControl(
            left,
            "left"
        );

        bindHoldControl(
            right,
            "right"
        );

        bindHoldControl(
            boost,
            "boost"
        );
    }


    function bindHoldControl(
        element,
        control
    ) {

        if (!element) return;

        const activate =
            event => {

                event.preventDefault();

                touchControls[
                    control
                ] = true;
            };

        const deactivate =
            event => {

                event.preventDefault();

                touchControls[
                    control
                ] = false;
            };

        element.addEventListener(
            "pointerdown",
            activate
        );

        element.addEventListener(
            "pointerup",
            deactivate
        );

        element.addEventListener(
            "pointercancel",
            deactivate
        );

        element.addEventListener(
            "pointerleave",
            deactivate
        );
    }


    /* =====================================================
       AUDIO
    ===================================================== */

    function ensureAudio() {

        if (
            audioContext
        ) {
            return;
        }

        const AudioContext =
            win.AudioContext ||
            win.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        try {

            audioContext =
                new AudioContext();

        } catch (_) {
            audioContext = null;
        }
    }


    function playTone(
        frequency,
        duration,
        type = "sine"
    ) {

        if (!audioContext) {
            return;
        }

        try {

            const oscillator =
                audioContext.createOscillator();

            const gain =
                audioContext.createGain();

            oscillator.type =
                type;

            oscillator.frequency.value =
                frequency;

            gain.gain.setValueAtTime(
                .0001,
                audioContext.currentTime
            );

            gain.gain.exponentialRampToValueAtTime(
                .055,
                audioContext.currentTime +
                .01
            );

            gain.gain.exponentialRampToValueAtTime(
                .0001,
                audioContext.currentTime +
                duration
            );

            oscillator.connect(
                gain
            );

            gain.connect(
                audioContext.destination
            );

            oscillator.start();

            oscillator.stop(
                audioContext.currentTime +
                duration +
                .02
            );

        } catch (_) {}
    }


    function stopAudio() {

        if (
            audioContext &&
            audioContext.state ===
            "running"
        ) {

            try {
                audioContext.suspend();
            } catch (_) {}
        }
    }


    /* =====================================================
       GAME UI
    ===================================================== */

    function updateGameUI() {

        if (!game) return;

        const scoreElements =
            $$("[data-game-score]");

        scoreElements.forEach(
            element => {

                element.textContent =
                    Math.floor(
                        game.score
                    ).toLocaleString();
            }
        );

        const distanceElements =
            $$("[data-game-distance]");

        distanceElements.forEach(
            element => {

                element.textContent =
                    `${Math.floor(
                        game.distance
                    )} m`;
            }
        );

        const healthElements =
            $$("[data-game-health]");

        healthElements.forEach(
            element => {

                element.textContent =
                    `${Math.round(
                        game.health
                    )}%`;
            }
        );

        const energyElements =
            $$("[data-game-energy]");

        energyElements.forEach(
            element => {

                element.textContent =
                    `${Math.round(
                        game.energy
                    )}%`;
            }
        );

        const comboElements =
            $$("[data-game-combo]");

        comboElements.forEach(
            element => {

                element.textContent =
                    `×${game.combo}`;
            }
        );

        const statusElements =
            $$("[data-game-status]");

        statusElements.forEach(
            element => {

                element.textContent =
                    game.status;
            }
        );

        const levelElements =
            $$("[data-game-level]");

        levelElements.forEach(
            element => {

                element.textContent =
                    String(
                        game.level
                    );
            }
        );
    }


    /* =====================================================
       EVENTS
    ===================================================== */

    function emitGameEvent(
        name,
        detail = {}
    ) {

        win.dispatchEvent(
            new CustomEvent(
                name,
                {
                    detail: {
                        gameId:
                            GAME_ID,

                        ...detail
                    }
                }
            )
        );
    }


    /* =====================================================
       DEBUG INFORMATION
    ===================================================== */

    function getDiagnostics() {

        if (!game) {
            return {
                initialized: false
            };
        }

        return {

            initialized: true,

            status:
                game.status,

            fps:
                Math.round(
                    game.fps
                ),

            quality:
                game.quality,

            score:
                Math.floor(
                    game.score
                ),

            distance:
                Math.floor(
                    game.distance
                ),

            level:
                game.level,

            difficulty:
                Number(
                    game.difficulty.toFixed(
                        2
                    )
                ),

            obstacles:
                game.obstacles.length,

            collectibles:
                game.collectibles.length,

            particles:
                game.particles.length,

            bestCombo:
                game.stats.bestCombo,

            highScore
        };
    }


    /* =====================================================
       PUBLIC GAME API
    ===================================================== */

    const ShadidGame = {

        start: startGame,

        pause: pauseGame,

        resume: resumeGame,

        restart: startGame,

        end: endGame,

        reset: resetGame,

        diagnostics:
            getDiagnostics,

        getState() {

            if (!game) {
                return null;
            }

            return {
                status:
                    game.status,

                score:
                    game.score,

                distance:
                    game.distance,

                health:
                    game.health,

                energy:
                    game.energy,

                combo:
                    game.combo,

                level:
                    game.level,

                highScore
            };
        },

        get highScore() {
            return highScore;
        },

        get canvas() {
            return canvas;
        }
    };

    win.ShadidGame =
        ShadidGame;


    /* =====================================================
       RESIZE
    ===================================================== */

    let resizeTimer = null;

    function handleResize() {

        clearTimeout(
            resizeTimer
        );

        resizeTimer =
            setTimeout(
                () => {

                    resizeCanvas();

                    if (game) {
                        render();
                    }

                },
                80
            );
    }


    /* =====================================================
       VISIBILITY HANDLING
    ===================================================== */

    function setupVisibility() {

        doc.addEventListener(
            "visibilitychange",
            () => {

                if (
                    doc.hidden &&
                    game?.status ===
                    "playing"
                ) {

                    pauseGame();
                }
            }
        );
    }


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    function init() {

        if (
            !findCanvas()
        ) {

            console.info(
                "[NOCLIP] Game canvas not found. " +
                "The game will initialize when a compatible " +
                "canvas is added."
            );

            return;
        }

        game =
            createGameState();

        resizeCanvas();

        initializeWorld();

        setupKeyboard();

        setupPointerControls();

        setupTouchControls();

        setupUIControls();

        setupVisibility();

        win.addEventListener(
            "resize",
            handleResize,
            {
                passive: true
            }
        );

        /*
         * Render the menu immediately.
         */
        render();

        /*
         * Keep the menu visually alive even before
         * the player starts.
         */
        startLoop();

        emitGameEvent(
            "portfolio:game-ready",
            {
                highScore
            }
        );

        console.info(
            "[NOCLIP] Game engine initialized."
        );
    }


    if (
        doc.readyState ===
        "loading"
    ) {

        doc.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();
    }


})();
