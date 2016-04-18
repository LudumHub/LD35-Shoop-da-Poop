﻿(function (globals) {
    "use strict";

    Bridge.define('ShoopDaPoop.Application.App', {
        statics: {
            renderer: null,
            board: null,
            stage: null,
            level: 0,
            textScreen: null,
            poopContainer: null,
            hint: null,
            restartButton: null,
            poops: null,
            config: {
                init: function () {
                    this.poopContainer = new PIXI.Container();
                    this.hint = PIXI.Sprite.fromImage("assets/Hint.png");
                    this.restartButton = PIXI.Sprite.fromImage("assets/Dood.png");
                    this.poops = new Bridge.List$1(ShoopDaPoop.Application.Poop)();
                    Bridge.ready(this.main);
                }
            },
            main: function () {
                ShoopDaPoop.Application.App.renderer = PIXI.autoDetectRenderer(600, 600, { backgroundColor: 1087931 });
                document.body.appendChild(ShoopDaPoop.Application.App.renderer.view);
                var audio = Bridge.merge(new Audio("assets/sandstorm.mp3"), {
                    loop: true
                } );
                document.body.appendChild(audio);
                audio.play();
                ShoopDaPoop.Application.App.stage = new PIXI.Container();
                ShoopDaPoop.Application.App.stage.addChild(PIXI.Sprite.fromImage("assets/Bathroom.png"));
                window.addEventListener("touchstart", function () {
                    audio.play();
                });
                ShoopDaPoop.Application.App.setupBoard();
                ShoopDaPoop.Application.App.stage.addChild(ShoopDaPoop.Application.App.hint);
                ShoopDaPoop.Application.App.hint.visible = false;
                ShoopDaPoop.Application.App.hint.position = new PIXI.Point(320, 120);
                ShoopDaPoop.Application.App.stage.addChild(ShoopDaPoop.Application.App.restartButton);
                ShoopDaPoop.Application.App.restartButton.interactive = false;
                ShoopDaPoop.Application.App.restartButton.on('mouseclick', ShoopDaPoop.Application.App.onRestartClick).on('touchend', ShoopDaPoop.Application.App.onRestartClick);
                ShoopDaPoop.Application.App.restartButton.alpha = 0.0;
                ShoopDaPoop.Application.App.restartButton.position = new PIXI.Point(510, 410);
                ShoopDaPoop.Application.App.textScreen = new ShoopDaPoop.Application.TextScreen();
                ShoopDaPoop.Application.App.textScreen.loadStartingScreen();
                ShoopDaPoop.Application.App.textScreen.onFadeOut = $_.ShoopDaPoop.Application.App.f1;
                ShoopDaPoop.Application.App.stage.addChild(ShoopDaPoop.Application.App.poopContainer);
                ShoopDaPoop.Application.App.stage.addChild(ShoopDaPoop.Application.App.textScreen.getContainer());
                ShoopDaPoop.Application.App.animate();
            },
            onRestartClick: function (arg) {
                ShoopDaPoop.Application.App.board.restart();
            },
            setupBoard: function () {
                var $t;
                ShoopDaPoop.Application.App.board = Bridge.merge(new ShoopDaPoop.Application.Board(10, 10), {
                    onMatch: ShoopDaPoop.Application.App.onBoardMatch,
                    onComplete: ShoopDaPoop.Application.App.onBoardComplete
                } );
                var temperatureDictionary = Bridge.merge(new Bridge.Dictionary$2(Number,Array)(), [
                    [0.2, [new ShoopDaPoop.Application.IntPoint(0, 4), new ShoopDaPoop.Application.IntPoint(0, 5), new ShoopDaPoop.Application.IntPoint(4, 0), new ShoopDaPoop.Application.IntPoint(5, 0), new ShoopDaPoop.Application.IntPoint(4, 9), new ShoopDaPoop.Application.IntPoint(5, 9), new ShoopDaPoop.Application.IntPoint(9, 4), new ShoopDaPoop.Application.IntPoint(9, 5)]],
                    [0.4, [new ShoopDaPoop.Application.IntPoint(1, 4), new ShoopDaPoop.Application.IntPoint(1, 5), new ShoopDaPoop.Application.IntPoint(4, 1), new ShoopDaPoop.Application.IntPoint(5, 1), new ShoopDaPoop.Application.IntPoint(4, 8), new ShoopDaPoop.Application.IntPoint(5, 8), new ShoopDaPoop.Application.IntPoint(8, 4), new ShoopDaPoop.Application.IntPoint(8, 5)]],
                    [0.6, [new ShoopDaPoop.Application.IntPoint(2, 4), new ShoopDaPoop.Application.IntPoint(2, 5), new ShoopDaPoop.Application.IntPoint(4, 2), new ShoopDaPoop.Application.IntPoint(5, 2), new ShoopDaPoop.Application.IntPoint(4, 7), new ShoopDaPoop.Application.IntPoint(5, 7), new ShoopDaPoop.Application.IntPoint(7, 4), new ShoopDaPoop.Application.IntPoint(7, 5)]],
                    [0.8, [new ShoopDaPoop.Application.IntPoint(3, 4), new ShoopDaPoop.Application.IntPoint(3, 5), new ShoopDaPoop.Application.IntPoint(4, 3), new ShoopDaPoop.Application.IntPoint(5, 3), new ShoopDaPoop.Application.IntPoint(4, 6), new ShoopDaPoop.Application.IntPoint(5, 6), new ShoopDaPoop.Application.IntPoint(6, 4), new ShoopDaPoop.Application.IntPoint(6, 5)]]
                ] );
                $t = Bridge.getEnumerator(temperatureDictionary);
                while ($t.moveNext()) {
                    var kvp = $t.getCurrent();
                    ShoopDaPoop.Application.App.board.getCellField().setTemperature(kvp.key, kvp.value);
                }
                var belly = [new ShoopDaPoop.Application.IntPoint(4, 4), new ShoopDaPoop.Application.IntPoint(5, 4), new ShoopDaPoop.Application.IntPoint(4, 5), new ShoopDaPoop.Application.IntPoint(5, 5)];
                ShoopDaPoop.Application.App.board.getCellField().setTemperature(1, belly);
                ShoopDaPoop.Application.App.stage.addChild(ShoopDaPoop.Application.App.board.getContainer());
            },
            onBoardComplete: function () {
                ShoopDaPoop.Application.App.level = (ShoopDaPoop.Application.App.level + 1) | 0;
                ShoopDaPoop.Application.App.hint.visible = false;
                ShoopDaPoop.Application.App.textScreen.fadeIn();
                if (ShoopDaPoop.Application.App.level === 5) {
                    ShoopDaPoop.Application.App.textScreen.loadGameOver();
                }
                else  {
                    ShoopDaPoop.Application.App.textScreen.loadPreLevelScreen(ShoopDaPoop.Application.App.level);
                }
                ShoopDaPoop.Application.App.textScreen.onFadeOut = $_.ShoopDaPoop.Application.App.f2;
                ShoopDaPoop.Application.App.restartButton.interactive = false;
            },
            onBoardMatch: function (arg) {
                var position = ShoopDaPoop.Application.PointExtensions.subtract(arg.toGlobal(ShoopDaPoop.Application.App.stage.position), new PIXI.Point(arg.width / 2, arg.height / 2));
                var poop = Bridge.merge(new ShoopDaPoop.Application.Poop(position), {
                    setTarget: new PIXI.Point(position.x, 400)
                } );
                ShoopDaPoop.Application.App.poops.add(poop);
                ShoopDaPoop.Application.App.poopContainer.addChild(poop.getSprite());
                poop.setOnExit(function () {
                    ShoopDaPoop.Application.App.poops.remove(poop);
                    ShoopDaPoop.Application.App.poopContainer.removeChild(poop.getSprite());
                });
            },
            loadLevel: function (level) {
                var items = Bridge.Linq.Enumerable.range(0, ((8 + ((level * 4) | 0)) | 0)).select(ShoopDaPoop.Application.App.getItem).toList(ShoopDaPoop.Application.Item);
                ShoopDaPoop.Application.App.board.fillWithItems(items);
                ShoopDaPoop.Application.App.restartButton.interactive = true;
            },
            animate: function () {
                var $t, $t1;
                window.requestAnimationFrame(ShoopDaPoop.Application.App.animate);
                ShoopDaPoop.Application.App.textScreen.update();
                if (ShoopDaPoop.Application.App.textScreen.getCurrentState() !== ShoopDaPoop.Application.TextScreen.State.visible) {
                    ShoopDaPoop.Application.App.board.update();
                    ShoopDaPoop.Application.App.board.preRender(new PIXI.Point(200, 400), new PIXI.Point(600, 400));
                    $t = Bridge.getEnumerator(ShoopDaPoop.Application.App.poops);
                    while ($t.moveNext()) {
                        var poop = $t.getCurrent();
                        poop.update();
                    }
                }
                else  {
                    $t1 = Bridge.getEnumerator(ShoopDaPoop.Application.App.poops);
                    while ($t1.moveNext()) {
                        var poop1 = $t1.getCurrent();
                        poop1.getOnExit()();
                    }
                }
                ShoopDaPoop.Application.App.renderer.render(ShoopDaPoop.Application.App.stage);
            },
            getItem: function (index) {
                if (index < 4) {
                    return new ShoopDaPoop.Application.CocaCola();
                }
                if (index < 8) {
                    return new ShoopDaPoop.Application.Pizza();
                }
                if (index < 12) {
                    return new ShoopDaPoop.Application.Snickers();
                }
                if (index < 16) {
                    return new ShoopDaPoop.Application.Fish();
                }
                if (index < 20) {
                    return new ShoopDaPoop.Application.PortalGun();
                }
                return new ShoopDaPoop.Application.God();
            }
        }
    });
    
    var $_ = {};
    
    Bridge.ns("ShoopDaPoop.Application.App", $_)
    
    Bridge.apply($_.ShoopDaPoop.Application.App, {
        f1: function () {
            ShoopDaPoop.Application.App.board.loadTutorial();
            ShoopDaPoop.Application.App.hint.visible = true;
            ShoopDaPoop.Application.App.restartButton.interactive = true;
        },
        f2: function () {
            ShoopDaPoop.Application.App.loadLevel(ShoopDaPoop.Application.App.level);
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.Board', {
        statics: {
            RequiredUpdatesSinceMovement: 60
        },
        updatesSinceCreation: 0,
        body: null,
        updatesSinceCellMovement: 60,
        onMatch: null,
        onComplete: null,
        isLevelLoaded: false,
        savedItems: null,
        savedShuffle: false,
        config: {
            properties: {
                CellField: null,
                Container: null,
                Items: null
            }
        },
        constructor: function (width, height) {
            this.setItems(new Bridge.List$1(ShoopDaPoop.Application.Item)());
            this.setContainer(new PIXI.Container());
            this.setCellField(new ShoopDaPoop.Application.CellField(width, height));
            this.body = Bridge.merge(new ShoopDaPoop.Application.Body(), {
                dragActions: Bridge.merge(new Bridge.Dictionary$2(ShoopDaPoop.Application.Limb,ShoopDaPoop.Application.DragActions)(), [
                    [ShoopDaPoop.Application.Limb.head, Bridge.merge(new ShoopDaPoop.Application.DragActions(), {
                        setPull: Bridge.fn.bind(this, $_.ShoopDaPoop.Application.Board.f1),
                        setPush: Bridge.fn.bind(this, $_.ShoopDaPoop.Application.Board.f2)
                    } )],
                    [ShoopDaPoop.Application.Limb.leftArm, Bridge.merge(new ShoopDaPoop.Application.DragActions(), {
                        setPull: Bridge.fn.bind(this, $_.ShoopDaPoop.Application.Board.f3),
                        setPush: Bridge.fn.bind(this, $_.ShoopDaPoop.Application.Board.f4)
                    } )],
                    [ShoopDaPoop.Application.Limb.rightArm, Bridge.merge(new ShoopDaPoop.Application.DragActions(), {
                        setPull: Bridge.fn.bind(this, $_.ShoopDaPoop.Application.Board.f5),
                        setPush: Bridge.fn.bind(this, $_.ShoopDaPoop.Application.Board.f6)
                    } )],
                    [ShoopDaPoop.Application.Limb.pinus, Bridge.merge(new ShoopDaPoop.Application.DragActions(), {
                        setPull: Bridge.fn.bind(this, $_.ShoopDaPoop.Application.Board.f7),
                        setPush: Bridge.fn.bind(this, $_.ShoopDaPoop.Application.Board.f8)
                    } )]
                ] )
            } );
            this.getContainer().addChild(this.getCellField().getContainer());
            this.getContainer().addChild(this.body.getContainer());
        },
        setInteractive: function (value) {
            this.body.setInteractive(value);
        },
        loadTutorial: function () {
            var items = Bridge.merge(new Bridge.List$1(ShoopDaPoop.Application.Item)(), [
                [new ShoopDaPoop.Application.Pizza()],
                [new ShoopDaPoop.Application.Pizza()],
                [new ShoopDaPoop.Application.CocaCola()],
                [new ShoopDaPoop.Application.CocaCola()],
                [new ShoopDaPoop.Application.CocaCola()],
                [new ShoopDaPoop.Application.CocaCola()],
                [new ShoopDaPoop.Application.Pizza()],
                [new ShoopDaPoop.Application.Pizza()]
            ] );
            this.fillWithItems(items, false);
        },
        restart: function () {
            var $t;
            var itemsCopy = new Bridge.List$1(ShoopDaPoop.Application.Item)(this.getItems());
            $t = Bridge.getEnumerator(itemsCopy);
            while ($t.moveNext()) {
                var item = $t.getCurrent();
                item.die();
            }
            this.getItems().clear();
            this.fillWithItems(this.savedItems, this.savedShuffle);
        },
        fillWithItems: function (items, shuffle) {
            var $t, $t1, $t2, $t3;
            if (shuffle === void 0) { shuffle = true; }
            this.savedItems = items;
            this.savedShuffle = shuffle;
            this.isLevelLoaded = true;
            if (shuffle) {
                var firstType = Bridge.Linq.Enumerable.from(items).first().getType();
                while (Bridge.Linq.Enumerable.from(items).take(4).all(function (item) {
                    return item.getType() === firstType;
                })) {
                    items = Bridge.Linq.Enumerable.from(items).shuffle().toList(ShoopDaPoop.Application.Item);
                    firstType = Bridge.Linq.Enumerable.from(items).first().getType();
                }
            }
            var cells = new Bridge.List$1(ShoopDaPoop.Application.Cell)();
            this.getCellField().forEachCell(function (point, cell) {
                cells.add(cell);
            });
            var cellGroups = Bridge.Linq.Enumerable.from(cells).groupBy($_.ShoopDaPoop.Application.Board.f9).orderByDescending($_.ShoopDaPoop.Application.Board.f10);
            var currentIndex = 0;
            $t = Bridge.getEnumerator(cellGroups);
            while ($t.moveNext()) {
                var $t1 = (function () {
                    var cellGroup = $t.getCurrent();
                    $t2 = Bridge.getEnumerator(shuffle ? cellGroup.shuffle() : cellGroup);
                    while ($t2.moveNext()) {
                        var $t3 = (function () {
                            var cell = $t2.getCurrent();
                            var item = items.getItem(Bridge.identity(currentIndex, (currentIndex = (currentIndex + 1) | 0)));
                            item.setPosition(cell.getPosition());
                            item.setState(ShoopDaPoop.Application.ItemState.spawned);
                            item.getSprite().position = cell.getSprite().position;
                            item.setBoard(this);
                            item.setTarget(cell);
                            cell.setTargetedBy(item);
                            this.getItems().add(item);
                            this.getContainer().addChild(item.getSprite());
                            item.onDeath = Bridge.fn.bind(this, function () {
                                this.getItems().remove(item);
                                this.getContainer().removeChild(item.getSprite());
                            });
                            if (currentIndex === items.getCount()) {
                                return {jump: 3};
                            }
                        }).call(this) || {};
                        if($t3.jump == 3) return {jump: 3, v: $t3.v};
                    }
                }).call(this) || {};
                if($t1.jump == 3) return $t1.v;
            }
        },
        clear: function () {
            this.getItems().clear();
        },
        update: function () {
            var $t;
            this.updatesSinceCreation = (this.updatesSinceCreation + 1) | 0;
            this.updatesSinceCellMovement = (this.updatesSinceCellMovement + 1) | 0;
            this.handleMatches();
            $t = Bridge.getEnumerator(this.getItems());
            while ($t.moveNext()) {
                var item = $t.getCurrent();
                item.update();
            }
            if (!Bridge.Linq.Enumerable.from(this.getItems()).any() && this.isLevelLoaded) {
                this.isLevelLoaded = false;
                this.onComplete();
            }
        },
        handleMatches: function () {
            var $t;
            var belly = [new ShoopDaPoop.Application.IntPoint(4, 4), new ShoopDaPoop.Application.IntPoint(5, 4), new ShoopDaPoop.Application.IntPoint(4, 5), new ShoopDaPoop.Application.IntPoint(5, 5)];
            var items = Bridge.Linq.Enumerable.from(belly).select(Bridge.fn.bind(this, $_.ShoopDaPoop.Application.Board.f11)).toList(ShoopDaPoop.Application.Item);
            if (Bridge.Linq.Enumerable.from(items).any($_.ShoopDaPoop.Application.Board.f12)) {
                return;
            }
            var firstType = Bridge.Linq.Enumerable.from(items).first().getType();
            if (Bridge.Linq.Enumerable.from(items).any(function (item) {
                return item.getType() !== firstType;
            })) {
                return;
            }
            this.onMatch(this.getCellField().getItem$1(5, 5).getSprite());
            $t = Bridge.getEnumerator(items);
            while ($t.moveNext()) {
                var item = $t.getCurrent();
                item.die();
            }
        },
        pull: function (side) {
            if (this.updatesSinceCellMovement < ShoopDaPoop.Application.Board.RequiredUpdatesSinceMovement) {
                return;
            }
            this.getCellField().pull(side);
            this.updatesSinceCellMovement = 0;
        },
        push: function (side) {
            if (this.updatesSinceCellMovement < ShoopDaPoop.Application.Board.RequiredUpdatesSinceMovement) {
                return;
            }
            this.getCellField().push(side);
            this.updatesSinceCellMovement = 0;
        },
        preRender: function (leftFootPosition, maxRightPosition) {
            var $t;
            if (Bridge.Linq.Enumerable.from(this.getItems()).any() && this.updatesSinceCreation > 3) {
                this.drawBody();
                var leftFootWorld = ShoopDaPoop.Application.PointExtensions.add(this.getContainer().position, this.body.getLeftFoot());
                var rightFootWorld = ShoopDaPoop.Application.PointExtensions.add(this.getContainer().position, this.body.getRightFoot());
                var currentVector = ShoopDaPoop.Application.PointExtensions.subtract(rightFootWorld, leftFootWorld);
                var targetVector = ShoopDaPoop.Application.PointExtensions.subtract(maxRightPosition, leftFootPosition);
                var currentLength = ShoopDaPoop.Application.PointExtensions.$length(currentVector);
                var targetLength = ShoopDaPoop.Application.PointExtensions.$length(targetVector);
                var dotProduct = currentVector.x * targetVector.x + currentVector.y * targetVector.y;
                var cos = dotProduct / (currentLength * targetLength);
                var angle = Math.acos(cos);
                if (currentVector.y > 0) {
                    angle *= -1;
                }
                this.getContainer().rotation = angle;
                var sin = Math.sin(angle);
                var actualLeftFootLocal = Bridge.merge(new PIXI.Point(), {
                    x: cos * this.body.getLeftFoot().x - sin * this.body.getLeftFoot().y,
                    y: cos * this.body.getLeftFoot().y + sin * this.body.getLeftFoot().x
                } );
                this.getContainer().position = ShoopDaPoop.Application.PointExtensions.add(this.getContainer().position, ShoopDaPoop.Application.PointExtensions.subtract(leftFootPosition, ShoopDaPoop.Application.PointExtensions.add(this.getContainer().position, actualLeftFootLocal)));
            }
            this.getCellField().preRender(new PIXI.Point());
            $t = Bridge.getEnumerator(this.getItems());
            while ($t.moveNext()) {
                var item = $t.getCurrent();
                item.preRender();
            }
        },
        drawBody: function () {
            var positions = Bridge.Linq.Enumerable.from(this.getItems()).select($_.ShoopDaPoop.Application.Board.f13);
            var orderedX = positions.orderBy($_.ShoopDaPoop.Application.Board.f14);
            var orderedY = positions.orderBy($_.ShoopDaPoop.Application.Board.f15);
            var firstX = orderedX.first();
            var firstY = orderedY.first();
            var lastX = orderedX.last();
            var lastY = orderedY.last();
            var allMinX = positions.where(function (pos) {
                return pos.position.x === firstX.position.x;
            });
            var allMinY = positions.where(function (pos) {
                return pos.position.y === firstY.position.y;
            });
            var allMaxX = positions.where(function (pos) {
                return pos.position.x === lastX.position.x;
            });
            var allMaxY = positions.where(function (pos) {
                return pos.position.y === lastY.position.y;
            });
            var minX = new PIXI.Point(firstX.position.x - firstX.bounds.width, allMinX.average($_.ShoopDaPoop.Application.Board.f15));
            var minY = new PIXI.Point(allMinY.average($_.ShoopDaPoop.Application.Board.f14), firstY.position.y - firstY.bounds.height);
            var maxX = new PIXI.Point(lastX.position.x + lastX.bounds.width, allMaxX.average($_.ShoopDaPoop.Application.Board.f15));
            var maxY = new PIXI.Point(allMaxY.average($_.ShoopDaPoop.Application.Board.f14), lastY.position.y + lastY.bounds.height);
            var leftTopCell = this.getCellField().getItem$1(4, 4);
            var rightBottomCell = this.getCellField().getItem$1(5, 5);
            var margin = 0.5;
            var leftTopSize = new PIXI.Point(leftTopCell.getSprite().texture.width * margin, leftTopCell.getSprite().texture.height * margin);
            var rightBottomSize = new PIXI.Point(rightBottomCell.getSprite().texture.width * margin, rightBottomCell.getSprite().texture.height * margin);
            var leftTop = ShoopDaPoop.Application.PointExtensions.subtract(leftTopCell.getSprite().position, leftTopSize);
            var rightBottom = ShoopDaPoop.Application.PointExtensions.add(rightBottomCell.getSprite().position, rightBottomSize);
            this.body.render(Bridge.merge(new ShoopDaPoop.Application.BodyPoints(), {
                setMinX: minX,
                setMinY: minY,
                setMaxX: maxX,
                setMaxY: maxY
            } ), Bridge.merge(new ShoopDaPoop.Application.BodyPoints(), {
                setMinX: leftTop,
                setMinY: leftTop,
                setMaxX: rightBottom,
                setMaxY: rightBottom
            } ));
        },
        isInBounds: function (position) {
            return this.getCellField().isInBounds(position);
        }
    });
    
    Bridge.ns("ShoopDaPoop.Application.Board", $_)
    
    Bridge.apply($_.ShoopDaPoop.Application.Board, {
        f1: function () {
            this.pull(ShoopDaPoop.Application.Side.top);
        },
        f2: function () {
            this.push(ShoopDaPoop.Application.Side.top);
        },
        f3: function () {
            this.pull(ShoopDaPoop.Application.Side.left);
        },
        f4: function () {
            this.push(ShoopDaPoop.Application.Side.left);
        },
        f5: function () {
            this.pull(ShoopDaPoop.Application.Side.right);
        },
        f6: function () {
            this.push(ShoopDaPoop.Application.Side.right);
        },
        f7: function () {
            this.pull(ShoopDaPoop.Application.Side.bottom);
        },
        f8: function () {
            this.push(ShoopDaPoop.Application.Side.bottom);
        },
        f9: function (cell) {
            return cell.getTemperature();
        },
        f10: function (group) {
            return group.key();
        },
        f11: function (pos) {
            return this.getCellField().getItem(pos).getTargetedBy();
        },
        f12: function (item) {
            return !Bridge.hasValue(item) || item.getState() !== ShoopDaPoop.Application.ItemState.idle;
        },
        f13: function (item) {
            return { position: item.getSprite().position, bounds: item.getSprite().getBounds() };
        },
        f14: function (pos) {
            return pos.position.x;
        },
        f15: function (pos) {
            return pos.position.y;
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.BoardSummary', {
        config: {
            properties: {
                PrefferedTarget: null,
                Items: null
            }
        },
        constructor: function (item, board) {
            this.setItems(Bridge.Linq.Enumerable.from(board.getItems()).where(function (i) {
                return i !== item;
            }).toList(ShoopDaPoop.Application.Item));
            var neighborCells = this.getLegalNeighborCells$1(item, board);
            var cellsByPriority = Bridge.Linq.Enumerable.from(neighborCells).where($_.ShoopDaPoop.Application.BoardSummary.f1).orderByDescending($_.ShoopDaPoop.Application.BoardSummary.f2).thenByDescending($_.ShoopDaPoop.Application.BoardSummary.f3);
            if (cellsByPriority.any()) {
                if (!Bridge.hasValue(item.getTarget())) {
                    this.setPrefferedTarget(cellsByPriority.first());
                    return;
                }
                var firstByTemperature = cellsByPriority.firstOrDefault(function (cell) {
                    return cell.getTemperature() > item.getTarget().getTemperature();
                }, null);
                if (Bridge.hasValue(firstByTemperature)) {
                    this.setPrefferedTarget(firstByTemperature);
                }
            }
        },
        getLegalNeighborPositions$1: function (item, board) {
            var offsets = [0, -1, 1];
            return Bridge.Linq.Enumerable.from(offsets).selectMany(function (x) {
                return Bridge.Linq.Enumerable.from(offsets).select(function (y) {
                    return new ShoopDaPoop.Application.IntPoint(x, y);
                });
            }).where($_.ShoopDaPoop.Application.BoardSummary.f4).select(function (pos) {
                return ShoopDaPoop.Application.PointExtensions.add$1(item.getPosition(), pos);
            }).where(Bridge.fn.bind(board, board.isInBounds)).toList(ShoopDaPoop.Application.IntPoint);
        },
        getLegalNeighborPositions: function (cell, board) {
            var offsets = [0, -1, 1];
            return Bridge.Linq.Enumerable.from(offsets).selectMany(function (x) {
                return Bridge.Linq.Enumerable.from(offsets).select(function (y) {
                    return new ShoopDaPoop.Application.IntPoint(x, y);
                });
            }).where($_.ShoopDaPoop.Application.BoardSummary.f4).select(function (pos) {
                return ShoopDaPoop.Application.PointExtensions.add$1(cell.getPosition(), pos);
            }).where(Bridge.fn.bind(board, board.isInBounds)).toList(ShoopDaPoop.Application.IntPoint);
        },
        getLegalNeighborCells: function (cell, board) {
            return Bridge.Linq.Enumerable.from(this.getLegalNeighborPositions(cell, board)).select(function (pos) {
                return board.getCellField().getItem(pos);
            }).toList(ShoopDaPoop.Application.Cell);
        },
        getLegalNeighborCells$1: function (item, board) {
            return Bridge.Linq.Enumerable.from(this.getLegalNeighborPositions$1(item, board)).select(function (pos) {
                return board.getCellField().getItem(pos);
            }).toList(ShoopDaPoop.Application.Cell);
        }
    });
    
    Bridge.ns("ShoopDaPoop.Application.BoardSummary", $_)
    
    Bridge.apply($_.ShoopDaPoop.Application.BoardSummary, {
        f1: function (cell) {
            return !Bridge.hasValue(cell.getTargetedBy()) && cell.getTemperature() > 0;
        },
        f2: function (cell) {
            return cell.getTemperature();
        },
        f3: function (cell) {
            return cell.getPosition().getY();
        },
        f4: function (pos) {
            return pos.getX() !== 0 || pos.getY() !== 0;
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.Body', {
        statics: {
            ShapeShiftSpeed: 1.0
        },
        graphics: null,
        rightLimbTexture: null,
        leftLimbTexture: null,
        leftLeg: null,
        rightLeg: null,
        leftArm: null,
        rightArm: null,
        head: null,
        pinus: null,
        bodyPoints: null,
        dragData: null,
        dragActions: null,
        normalFace: null,
        yeeeFace: null,
        painFace: null,
        config: {
            properties: {
                Container: null,
                LeftFoot: null,
                RightFoot: null
            },
            init: function () {
                this.rightLimbTexture = PIXI.Texture.fromImage("assets/RightLimb.png");
                this.leftLimbTexture = PIXI.Texture.fromImage("assets/LeftLimb.png");
                this.dragActions = new Bridge.Dictionary$2(ShoopDaPoop.Application.Limb,ShoopDaPoop.Application.DragActions)();
                this.normalFace = PIXI.Texture.fromImage("assets/Dood.png");
                this.yeeeFace = PIXI.Texture.fromImage("assets/Yeee.png");
                this.painFace = PIXI.Texture.fromImage("assets/Pain.png");
            }
        },
        constructor: function () {
            var pullOffset = 50.0;
            var pushOffset = 20.0;
            this.graphics = new PIXI.Graphics();
            this.head = Bridge.merge(new PIXI.Sprite(this.normalFace), {
                anchor: new PIXI.Point(0.5, 0.6)
            } );
            this.head.interactive = true;
            this.applyDragBehavior(this.head, Bridge.merge(new ShoopDaPoop.Application.Body.DragDataParams(), {
                setLimb: ShoopDaPoop.Application.Limb.head,
                setDragResult: function (from, to) {
                    if (from.y - to.y >= pullOffset) {
                        return ShoopDaPoop.Application.Body.DragStatus.pull;
                    }
                    if (to.y - from.y >= pushOffset) {
                        return ShoopDaPoop.Application.Body.DragStatus.push;
                    }
                    return ShoopDaPoop.Application.Body.DragStatus.none;
                },
                setRotationMultiplier: $_.ShoopDaPoop.Application.Body.f1
            } ));
    
            this.leftLeg = Bridge.merge(new PIXI.Sprite(this.leftLimbTexture), {
                anchor: new PIXI.Point(0.5, 0)
            } );
    
            this.rightLeg = Bridge.merge(new PIXI.Sprite(this.rightLimbTexture), {
                anchor: new PIXI.Point(0.5, 0)
            } );
    
            this.leftArm = Bridge.merge(new PIXI.Sprite(this.leftLimbTexture), {
                anchor: new PIXI.Point(0.5, 0.1)
            } );
            this.leftArm.interactive = true;
            this.applyDragBehavior(this.leftArm, Bridge.merge(new ShoopDaPoop.Application.Body.DragDataParams(), {
                setLimb: ShoopDaPoop.Application.Limb.leftArm,
                setDragResult: function (from, to) {
                    if (from.x - to.x >= pullOffset) {
                        return ShoopDaPoop.Application.Body.DragStatus.pull;
                    }
                    if (to.x - from.x >= pushOffset) {
                        return ShoopDaPoop.Application.Body.DragStatus.push;
                    }
                    return ShoopDaPoop.Application.Body.DragStatus.none;
                },
                setRotationMultiplier: $_.ShoopDaPoop.Application.Body.f2
            } ));
    
            this.rightArm = Bridge.merge(new PIXI.Sprite(this.rightLimbTexture), {
                anchor: new PIXI.Point(0.5, 0.1)
            } );
            this.rightArm.interactive = true;
            this.applyDragBehavior(this.rightArm, Bridge.merge(new ShoopDaPoop.Application.Body.DragDataParams(), {
                setLimb: ShoopDaPoop.Application.Limb.rightArm,
                setDragResult: function (from, to) {
                    if (to.x - from.x >= pullOffset) {
                        return ShoopDaPoop.Application.Body.DragStatus.pull;
                    }
                    if (from.x - to.x >= pushOffset) {
                        return ShoopDaPoop.Application.Body.DragStatus.push;
                    }
                    return ShoopDaPoop.Application.Body.DragStatus.none;
                },
                setRotationMultiplier: $_.ShoopDaPoop.Application.Body.f2
            } ));
    
    
            this.pinus = Bridge.merge(new PIXI.Sprite(PIXI.Texture.fromImage("assets/Pinus.png")), {
                anchor: new PIXI.Point(0.5, 0.1)
            } );
            this.pinus.interactive = true;
            this.applyDragBehavior(this.pinus, Bridge.merge(new ShoopDaPoop.Application.Body.DragDataParams(), {
                setLimb: ShoopDaPoop.Application.Limb.pinus,
                setDragResult: function (from, to) {
                    if (to.y - from.y >= pullOffset) {
                        return ShoopDaPoop.Application.Body.DragStatus.pull;
                    }
                    if (from.y - to.y >= pushOffset) {
                        return ShoopDaPoop.Application.Body.DragStatus.push;
                    }
                    return ShoopDaPoop.Application.Body.DragStatus.none;
                },
                setRotationMultiplier: $_.ShoopDaPoop.Application.Body.f2
            } ));
    
            this.setContainer(new PIXI.Container());
            this.getContainer().addChild(this.leftLeg);
            this.getContainer().addChild(this.rightLeg);
            this.getContainer().addChild(this.head);
            this.getContainer().addChild(this.leftArm);
            this.getContainer().addChild(this.rightArm);
            this.getContainer().addChild(this.graphics);
            this.getContainer().addChild(this.pinus);
        },
        setInteractive: function (value) {
            var $t;
            var limbs = [this.head, this.leftLeg, this.leftArm, this.pinus];
            $t = Bridge.getEnumerator(limbs);
            while ($t.moveNext()) {
                var limb = $t.getCurrent();
                limb.interactive = value;
            }
        },
        applyDragBehavior: function (sprite, params) {
            sprite.on('mousedown', Bridge.fn.bind(this, function (e) {
                this.onDragStart(sprite, e, params);
            })).on('touchstart', Bridge.fn.bind(this, function (e) {
                this.onDragStart(sprite, e, params);
            })).on('mouseup', Bridge.fn.bind(this, function (e) {
                this.onDragEnd(sprite, e);
            })).on('mouseupoutside', Bridge.fn.bind(this, function (e) {
                this.onDragEnd(sprite, e);
            })).on('touchend', Bridge.fn.bind(this, function (e) {
                this.onDragEnd(sprite, e);
            })).on('touchendoutside', Bridge.fn.bind(this, function (e) {
                this.onDragEnd(sprite, e);
            })).on('touchmove', Bridge.fn.bind(this, function (e) {
                this.onDragMove(sprite, e);
            })).on("mousemove", Bridge.fn.bind(this, function (e) {
                this.onDragMove(sprite, e);
            }));
        },
        onDragMove: function (target, arg) {
            if (!Bridge.hasValue(this.dragData) || this.dragData.getTarget() !== target) {
                return;
            }
            this.dragData.setCurrent(arg.data.getLocalPosition(this.getContainer()));
        },
        onDragEnd: function (target, arg) {
            if (!Bridge.hasValue(this.dragData) || this.dragData.getTarget() !== target) {
                return;
            }
            this.dragData.getTarget().rotation = 0;
            this.dragData = null;
            this.head.texture = this.normalFace;
        },
        onDragStart: function (target, arg, params) {
            var $t;
            if (Bridge.hasValue(this.dragData)) {
                return;
            }
            this.dragData = Bridge.merge(new ShoopDaPoop.Application.Body.DragData(params), {
                setTarget: target,
                setStart: arg.data.getLocalPosition(this.getContainer()),
                setCurrent: arg.data.getLocalPosition(this.getContainer()),
                setStartTargetPosition: target.position.clone()
            } );
            if (params.getLimb() === ShoopDaPoop.Application.Limb.head) {
                $t = this.dragData.getStartTargetPosition();
                $t.y += target.height * 0.4;
            }
            switch (this.dragData.getParams().getLimb()) {
                case ShoopDaPoop.Application.Limb.leftArm: 
                case ShoopDaPoop.Application.Limb.rightArm: 
                case ShoopDaPoop.Application.Limb.head: 
                    this.head.texture = this.painFace;
                    break;
                case ShoopDaPoop.Application.Limb.pinus: 
                    this.head.texture = this.yeeeFace;
                    break;
                default: 
                    throw new Bridge.ArgumentOutOfRangeException();
            }
        },
        render: function (newBodyPoints, bellyPoints) {
            var $t;
            if (!Bridge.hasValue(this.bodyPoints)) {
                if (!Bridge.hasValue(newBodyPoints)) {
                    return;
                }
                this.bodyPoints = newBodyPoints;
            }
            else  {
                var pointPairs = Bridge.merge(new Bridge.List$1(Object)(), [
                    [{ item1: this.bodyPoints.getMaxX(), item2: newBodyPoints.getMaxX() }],
                    [{ item1: this.bodyPoints.getMaxY(), item2: newBodyPoints.getMaxY() }],
                    [{ item1: this.bodyPoints.getMinX(), item2: newBodyPoints.getMinX() }],
                    [{ item1: this.bodyPoints.getMinY(), item2: newBodyPoints.getMinY() }]
                ] );
                $t = Bridge.getEnumerator(pointPairs);
                while ($t.moveNext()) {
                    var tuple = $t.getCurrent();
                    var from = tuple.item1.clone();
                    var to = tuple.item2.clone();
                    var result;
                    var differenceToTarget = ShoopDaPoop.Application.PointExtensions.subtract(to, from);
                    if (Math.abs(differenceToTarget.x) < ShoopDaPoop.Application.Body.ShapeShiftSpeed && Math.abs(differenceToTarget.y) < ShoopDaPoop.Application.Body.ShapeShiftSpeed) {
                        result = to;
                    }
                    else  {
                        ShoopDaPoop.Application.PointExtensions.normalize(differenceToTarget);
                        result = ShoopDaPoop.Application.PointExtensions.add(from, ShoopDaPoop.Application.PointExtensions.multiply(differenceToTarget, ShoopDaPoop.Application.Body.ShapeShiftSpeed));
                    }
                    tuple.item1.x = result.x;
                    tuple.item1.y = result.y;
                }
            }
    
            this.graphics.clear().lineStyle(10, 16740352, 0.8).moveTo(this.bodyPoints.getMinX().x, this.bodyPoints.getMinX().y).beginFill(16752507, 1).quadraticCurveTo(this.bodyPoints.getMinX().x, this.bodyPoints.getMinY().y, this.bodyPoints.getMinY().x, this.bodyPoints.getMinY().y).quadraticCurveTo(this.bodyPoints.getMaxX().x, this.bodyPoints.getMinY().y, this.bodyPoints.getMaxX().x, this.bodyPoints.getMaxX().y).quadraticCurveTo(this.bodyPoints.getMaxX().x, this.bodyPoints.getMaxY().y, this.bodyPoints.getMaxY().x, this.bodyPoints.getMaxY().y).quadraticCurveTo(this.bodyPoints.getMinX().x, this.bodyPoints.getMaxY().y, this.bodyPoints.getMinX().x, this.bodyPoints.getMinX().y).endFill().lineStyle(5, 16724787).beginFill(16733525).drawRoundedRect(bellyPoints.getMinX().x, bellyPoints.getMinY().y, bellyPoints.getMaxX().x - bellyPoints.getMinX().x, bellyPoints.getMaxY().y - bellyPoints.getMinY().y, 3).endFill();
            var positionDifference = ShoopDaPoop.Application.PointExtensions.subtract(this.bodyPoints.getMaxY(), this.bodyPoints.getMinX());
            this.leftLeg.position = ShoopDaPoop.Application.PointExtensions.subtract(this.bodyPoints.getMaxY(), ShoopDaPoop.Application.PointExtensions.multiply(positionDifference, 0.5));
            positionDifference = ShoopDaPoop.Application.PointExtensions.subtract(this.bodyPoints.getMaxX(), this.bodyPoints.getMaxY());
            this.rightLeg.position = ShoopDaPoop.Application.PointExtensions.add(this.bodyPoints.getMaxY(), ShoopDaPoop.Application.PointExtensions.multiply(positionDifference, 0.5));
            this.leftArm.position = this.bodyPoints.getMinX();
            this.rightArm.position = this.bodyPoints.getMaxX();
            this.head.position = this.bodyPoints.getMinY();
            this.pinus.position = ShoopDaPoop.Application.PointExtensions.subtract(this.bodyPoints.getMaxY(), new PIXI.Point(0, 10));
            if (Bridge.hasValue(this.dragData)) {
                this.dragData.applyDragging();
                this.dragData.applyRotation();
                var handler = this.dragActions.get(this.dragData.getParams().getLimb());
                switch (this.dragData.getDragStatus()) {
                    case ShoopDaPoop.Application.Body.DragStatus.pull: 
                        handler.getPull()();
                        break;
                    case ShoopDaPoop.Application.Body.DragStatus.push: 
                        handler.getPush()();
                        break;
                }
            }
            this.setLeftFoot(ShoopDaPoop.Application.PointExtensions.add(this.leftLeg.position, new PIXI.Point(-this.leftLeg.width * 0.3, this.leftLeg.height)));
            this.setRightFoot(ShoopDaPoop.Application.PointExtensions.add(this.rightLeg.position, new PIXI.Point(this.rightLeg.width * 0.3, this.rightLeg.height)));
        }
    });
    
    Bridge.ns("ShoopDaPoop.Application.Body", $_)
    
    Bridge.apply($_.ShoopDaPoop.Application.Body, {
        f1: function (from, to) {
            return to.x < from.x ? -1 : 1;
        },
        f2: function (from, to) {
            return from.x < to.x ? -1 : 1;
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.Body.DragData', {
        config: {
            properties: {
                Params: null,
                Target: null,
                Start: null,
                StartTargetPosition: null,
                Current: null
            }
        },
        constructor: function (params) {
            this.setParams(params);
        },
        applyDragging: function () {
            var difference = ShoopDaPoop.Application.PointExtensions.subtract(this.getCurrent(), this.getTarget().position);
            this.getTarget().position = ShoopDaPoop.Application.PointExtensions.add(this.getTarget().position, ShoopDaPoop.Application.PointExtensions.multiply(difference, 0.2));
        },
        applyRotation: function () {
            var currentVector = ShoopDaPoop.Application.PointExtensions.subtract(this.getStart(), this.getStartTargetPosition());
            var targetVector = ShoopDaPoop.Application.PointExtensions.subtract(this.getCurrent(), this.getStartTargetPosition());
            var currentLength = ShoopDaPoop.Application.PointExtensions.$length(currentVector);
            var targetLength = ShoopDaPoop.Application.PointExtensions.$length(targetVector);
            var dotProduct = currentVector.x * targetVector.x + currentVector.y * targetVector.y;
            var cos = dotProduct / (currentLength * targetLength);
            var angle = Math.acos(cos);
            if (Bridge.hasValue(this.getParams().getRotationMultiplier())) {
                angle *= this.getParams().getRotationMultiplier()(currentVector, targetVector);
            }
            this.getTarget().rotation = angle;
        },
        getDragStatus: function () {
            return this.getParams().getDragResult()(this.getStart(), this.getCurrent());
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.Body.DragDataParams', {
        config: {
            properties: {
                DragResult: null,
                RotationMultiplier: null,
                Limb: 0
            }
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.Body.DragStatus', {
        statics: {
            none: 0,
            pull: 1,
            push: 2
        },
        $enum: true
    });
    
    Bridge.define('ShoopDaPoop.Application.BodyPoints', {
        config: {
            properties: {
                MinX: null,
                MaxX: null,
                MinY: null,
                MaxY: null
            }
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.Cell', {
        config: {
            properties: {
                Temperature: 0,
                Position: null,
                Sprite: null,
                TargetedBy: null
            }
        },
        constructor: function (texture) {
            if (texture === void 0) { texture = null; }
    
            this.setSprite(Bridge.merge(new PIXI.Sprite(texture), {
                anchor: new PIXI.Point(0.5, 0.5)
            } ));
        },
        getWorldPosition: function () {
            return this.getSprite().position;
        },
        setWorldPosition: function (value) {
            this.getSprite().position = value;
        },
        getWidth: function () {
            return this.getSprite().texture.width;
        },
        getHeight: function () {
            return this.getSprite().texture.height;
        },
        preRender: function (position) {
            ShoopDaPoop.Application.PointExtensions.set(this.getSprite().position, position);
            this.getSprite().alpha = 0;
            /* if (Sprite.Alpha == 0)
    			{
    				Sprite.Alpha = 0.1f;
    			}*/
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.CellField', {
        cellTexture: null,
        bodySides: null,
        config: {
            properties: {
                Cells: null,
                Container: null,
                Width: 0,
                Height: 0
            },
            init: function () {
                this.bodySides = Bridge.merge(new Bridge.Dictionary$2(ShoopDaPoop.Application.Side,Bridge.List$1(ShoopDaPoop.Application.CellField.BodySide))(), [
        [ShoopDaPoop.Application.Side.bottom, Bridge.merge(new Bridge.List$1(ShoopDaPoop.Application.CellField.BodySide)(), [
            [Bridge.merge(new ShoopDaPoop.Application.CellField.BodySide(), {
                belly: new ShoopDaPoop.Application.IntPoint(4, 5),
                border: new ShoopDaPoop.Application.IntPoint(4, 9),
                innerSide: ShoopDaPoop.Application.Side.left
            } )],
            [Bridge.merge(new ShoopDaPoop.Application.CellField.BodySide(), {
                belly: new ShoopDaPoop.Application.IntPoint(5, 5),
                border: new ShoopDaPoop.Application.IntPoint(5, 9),
                innerSide: ShoopDaPoop.Application.Side.right
            } )]
        ] )],
        [ShoopDaPoop.Application.Side.left, Bridge.merge(new Bridge.List$1(ShoopDaPoop.Application.CellField.BodySide)(), [
            [Bridge.merge(new ShoopDaPoop.Application.CellField.BodySide(), {
                belly: new ShoopDaPoop.Application.IntPoint(4, 4),
                border: new ShoopDaPoop.Application.IntPoint(0, 4),
                innerSide: ShoopDaPoop.Application.Side.top
            } )],
            [Bridge.merge(new ShoopDaPoop.Application.CellField.BodySide(), {
                belly: new ShoopDaPoop.Application.IntPoint(4, 5),
                border: new ShoopDaPoop.Application.IntPoint(0, 5),
                innerSide: ShoopDaPoop.Application.Side.bottom
            } )]
        ] )],
        [ShoopDaPoop.Application.Side.top, Bridge.merge(new Bridge.List$1(ShoopDaPoop.Application.CellField.BodySide)(), [
            [Bridge.merge(new ShoopDaPoop.Application.CellField.BodySide(), {
                belly: new ShoopDaPoop.Application.IntPoint(4, 4),
                border: new ShoopDaPoop.Application.IntPoint(4, 0),
                innerSide: ShoopDaPoop.Application.Side.left
            } )],
            [Bridge.merge(new ShoopDaPoop.Application.CellField.BodySide(), {
                belly: new ShoopDaPoop.Application.IntPoint(5, 4),
                border: new ShoopDaPoop.Application.IntPoint(5, 0),
                innerSide: ShoopDaPoop.Application.Side.right
            } )]
        ] )],
        [ShoopDaPoop.Application.Side.right, Bridge.merge(new Bridge.List$1(ShoopDaPoop.Application.CellField.BodySide)(), [
            [Bridge.merge(new ShoopDaPoop.Application.CellField.BodySide(), {
                belly: new ShoopDaPoop.Application.IntPoint(5, 4),
                border: new ShoopDaPoop.Application.IntPoint(9, 4),
                innerSide: ShoopDaPoop.Application.Side.top
            } )],
            [Bridge.merge(new ShoopDaPoop.Application.CellField.BodySide(), {
                belly: new ShoopDaPoop.Application.IntPoint(5, 5),
                border: new ShoopDaPoop.Application.IntPoint(9, 5),
                innerSide: ShoopDaPoop.Application.Side.bottom
            } )]
        ] )]
    ] );
            }
        },
        constructor: function (width, height) {
            this.setWidth(width);
            this.setHeight(height);
            this.setContainer(new PIXI.Container());
            this.cellTexture = PIXI.Texture.fromImage("assets/Tile.png");
            this.setCells(Bridge.Array.create(null, null, width, height));
            this.forEachPosition(Bridge.fn.bind(this, $_.ShoopDaPoop.Application.CellField.f1));
            this.forEachCell(Bridge.fn.bind(this, $_.ShoopDaPoop.Application.CellField.f2));
        },
        getItem: function (point) {
            return this.getCells().get([point.getX(), point.getY()]);
        },
        setItem: function (point, value) {
            this.getCells().set([point.getX(), point.getY()], value);
        },
        getItem$1: function (x, y) {
            return this.getCells().get([x, y]);
        },
        setItem$1: function (x, y, value) {
            this.getCells().set([x, y], value);
        },
        setTemperature: function (temperature, coordinates) {
            var $t;
            if (coordinates === void 0) { coordinates = []; }
            $t = Bridge.getEnumerator(coordinates);
            while ($t.moveNext()) {
                var coordinate = $t.getCurrent();
                this.getItem(coordinate).setTemperature(temperature);
            }
        },
        preRender: function (position) {
            this.getContainer().position = position;
            this.forEachCell($_.ShoopDaPoop.Application.CellField.f3);
        },
        shift: function (from, to) {
            if (from.getX() !== to.getX() && from.getY() !== to.getY()) {
                throw new Bridge.InvalidOperationException("Not a staright line");
            }
            var direction = new ShoopDaPoop.Application.IntPoint(((from.getX() - to.getX()) | 0), ((from.getY() - to.getY()) | 0));
            if (direction.getX() === 0) {
                direction.setY((Bridge.Int.div(direction.getY(), Math.abs(direction.getY()))) | 0);
            }
            else  {
                direction.setX((Bridge.Int.div(direction.getX(), Math.abs(direction.getX()))) | 0);
            }
            var currentPoint = to;
            while (currentPoint.getX() !== from.getX() || currentPoint.getY() !== from.getY()) {
                var nextPoint = ShoopDaPoop.Application.PointExtensions.add$1(currentPoint, direction);
                var moveToCell = this.getItem(currentPoint);
                var moveFromCell = this.getItem(nextPoint);
                currentPoint = nextPoint;
                if (Bridge.hasValue(moveToCell.getTargetedBy())) {
                    continue;
                }
                var item = moveFromCell.getTargetedBy();
                if (Bridge.hasValue(item)) {
                    item.assignTarget(moveToCell);
                }
            }
        },
        pull: function (side) {
            var $t, $t1;
            var sides = this.bodySides.get(side);
            $t = Bridge.getEnumerator(sides);
            while ($t.moveNext()) {
                var bodySide = $t.getCurrent();
                this.shift(bodySide.belly, bodySide.border);
            }
            var pushedSides = Bridge.Linq.Enumerable.from(this.bodySides).selectMany($_.ShoopDaPoop.Application.CellField.f4).where(function (s) {
                return s.innerSide === side;
            });
            $t1 = Bridge.getEnumerator(pushedSides);
            while ($t1.moveNext()) {
                var pushedSide = $t1.getCurrent();
                this.shift(pushedSide.border, pushedSide.belly);
            }
        },
        push: function (side) {
            var $t, $t1;
            var pushedSides = Bridge.Linq.Enumerable.from(this.bodySides).selectMany($_.ShoopDaPoop.Application.CellField.f4).where(function (s) {
                return s.innerSide === side;
            });
            $t = Bridge.getEnumerator(pushedSides);
            while ($t.moveNext()) {
                var pushedSide = $t.getCurrent();
                this.shift(pushedSide.belly, pushedSide.border);
            }
            var sides = this.bodySides.get(side);
            $t1 = Bridge.getEnumerator(sides);
            while ($t1.moveNext()) {
                var bodySide = $t1.getCurrent();
                this.shift(bodySide.border, bodySide.belly);
            }
        },
        forEachCell: function (action) {
            this.forEachPosition(Bridge.fn.bind(this, function (point) {
                action(point, this.getCells().get([point.getX(), point.getY()]));
            }));
        },
        forEachPosition: function (action) {
            for (var x = 0; x < this.getWidth(); x = (x + 1) | 0) {
                for (var y = 0; y < this.getHeight(); y = (y + 1) | 0) {
                    action(new ShoopDaPoop.Application.IntPoint(x, y));
                }
            }
        },
        isInBounds: function (position) {
            return position.getX() >= 0 && position.getX() < this.getWidth() && position.getY() >= 0 && position.getY() < this.getHeight();
        }
    });
    
    Bridge.ns("ShoopDaPoop.Application.CellField", $_)
    
    Bridge.apply($_.ShoopDaPoop.Application.CellField, {
        f1: function (point) {
            this.setItem(point, Bridge.merge(new ShoopDaPoop.Application.Cell(this.cellTexture), {
                setPosition: point
            } ));
        },
        f2: function (point, cell) {
            cell.setWorldPosition(new PIXI.Point(point.getX() * cell.getWidth(), point.getY() * cell.getHeight()));
            this.getContainer().addChild(cell.getSprite());
        },
        f3: function (point, cell) {
            cell.preRender(new PIXI.Point(point.getX() * cell.getWidth(), point.getY() * cell.getHeight()));
        },
        f4: function (s) {
            return s.value;
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.CellField.BodySide', {
        belly: null,
        border: null,
        innerSide: 0
    });
    
    Bridge.define('ShoopDaPoop.Application.Item', {
        onDeath: null,
        config: {
            properties: {
                Selected: false,
                Board: null,
                Position: null,
                State: 0,
                Sprite: null,
                Target: null,
                MoveSpeed: 0
            }
        },
        constructor: function (texture) {
            if (texture === void 0) { texture = null; }
    
            this.setSprite(Bridge.merge(new PIXI.Sprite(texture), {
                anchor: new PIXI.Point(0.5, 0.5),
                scale: new PIXI.Point()
            } ));
            this.setMoveSpeed(1);
        },
        update: function () {
            var summary = new ShoopDaPoop.Application.BoardSummary(this, this.getBoard());
            switch (this.getState()) {
                case ShoopDaPoop.Application.ItemState.spawned: 
                    this.handleSpawnedState(summary);
                    break;
                case ShoopDaPoop.Application.ItemState.moving: 
                    break;
                case ShoopDaPoop.Application.ItemState.idle: 
                    this.handleIdleState(summary);
                    break;
                case ShoopDaPoop.Application.ItemState.dying: 
                    this.handleDying();
                    break;
                default: 
                    throw new Bridge.ArgumentOutOfRangeException();
            }
        },
        handleDying: function () {
            if (this.getSprite().scale.x < 0.1) {
                this.getSprite().destroy();
                this.setState(ShoopDaPoop.Application.ItemState.died);
                this.onDeath();
                return;
            }
            this.getSprite().scale = ShoopDaPoop.Application.PointExtensions.subtract(this.getSprite().scale, new PIXI.Point(0.1, 0.1));
        },
        handleIdleState: function (summary) {
            var $t;
            if (this.getSelected()) {
                $t = this.getSprite();
                $t.rotation += 0.1;
            }
            if (Bridge.hasValue(summary.getPrefferedTarget())) {
                this.assignTarget(summary.getPrefferedTarget());
            }
        },
        handleSpawnedState: function (summary) {
            var $t, $t1;
            if (this.getSprite().scale.x < 1.0) {
                $t = this.getSprite().scale;
                $t.x += 0.1;
                $t1 = this.getSprite().scale;
                $t1.y += 0.1;
            }
            else  {
                this.getSprite().scale = new PIXI.Point(1, 1);
                this.setState(ShoopDaPoop.Application.ItemState.idle);
            }
        },
        assignTarget: function (target) {
            if (Bridge.hasValue(this.getTarget())) {
                this.getTarget().setTargetedBy(null);
            }
            this.setTarget(target);
            this.getTarget().setTargetedBy(this);
            this.setState(ShoopDaPoop.Application.ItemState.moving);
            this.setSelected(false);
            this.getSprite().rotation = 0;
        },
        preRender: function () {
            if (this.getState() === ShoopDaPoop.Application.ItemState.spawned) {
                return;
            }
            if (Bridge.hasValue(this.getTarget())) {
                var differenceToTarget = ShoopDaPoop.Application.PointExtensions.subtract(this.getTarget().getSprite().position, this.getSprite().position);
                if (Math.abs(differenceToTarget.x) < this.getMoveSpeed() && Math.abs(differenceToTarget.y) < this.getMoveSpeed()) {
                    this.setState(ShoopDaPoop.Application.ItemState.idle);
                    this.setPosition(this.getTarget().getPosition());
                    this.getSprite().position = this.getTarget().getSprite().position;
                    return;
                }
                this.setState(ShoopDaPoop.Application.ItemState.moving);
                ShoopDaPoop.Application.PointExtensions.normalize(differenceToTarget);
                this.getSprite().position = ShoopDaPoop.Application.PointExtensions.add(this.getSprite().position, ShoopDaPoop.Application.PointExtensions.multiply(differenceToTarget, this.getMoveSpeed()));
            }
        },
        die: function () {
            if (this.getState() === ShoopDaPoop.Application.ItemState.died) {
                return;
            }
            this.setState(ShoopDaPoop.Application.ItemState.dying);
            this.getTarget().setTargetedBy(null);
            this.setTarget(null);
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.DragActions', {
        config: {
            properties: {
                Pull: null,
                Push: null
            }
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.FaceStatus', {
        statics: {
            normal: 0,
            yeee: 1,
            pain: 2
        },
        $enum: true
    });
    
    Bridge.define('ShoopDaPoop.Application.IntPoint', {
        config: {
            properties: {
                X: 0,
                Y: 0
            }
        },
        constructor: function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
    
            this.setX(x);
            this.setY(y);
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.ItemState', {
        statics: {
            spawned: 0,
            moving: 1,
            idle: 2,
            dying: 3,
            died: 4
        },
        $enum: true
    });
    
    Bridge.define('ShoopDaPoop.Application.ItemType', {
        statics: {
            square: 0,
            circle: 1,
            diamond: 2,
            snake: 3
        },
        $enum: true
    });
    
    Bridge.define('ShoopDaPoop.Application.Limb', {
        statics: {
            leftArm: 0,
            rightArm: 1,
            head: 2,
            pinus: 3
        },
        $enum: true
    });
    
    Bridge.define('ShoopDaPoop.Application.PointExtensions', {
        statics: {
            set: function (point, value) {
                point.set(value.x, value.y);
            },
            subtract: function (point, value) {
                return new PIXI.Point(point.x - value.x, point.y - value.y);
            },
            add: function (point, value) {
                return new PIXI.Point(point.x + value.x, point.y + value.y);
            },
            add$1: function (point, value) {
                return new ShoopDaPoop.Application.IntPoint(((point.getX() + value.getX()) | 0), ((point.getY() + value.getY()) | 0));
            },
            multiply: function (point, value) {
                return new PIXI.Point(point.x * value, point.y * value);
            },
            normalize: function (point) {
                var val = 1.0 / Math.sqrt(point.x * point.x + point.y * point.y);
                point.x *= val;
                point.y *= val;
            },
            myDistinct: function (T, enumerable) {
                var $t;
                var $yield = [];
                var yielded = new Bridge.List$1(T)();
                $t = Bridge.getEnumerator(enumerable);
                while ($t.moveNext()) {
                    var item = $t.getCurrent();
                    if (yielded.contains(item)) {
                        continue;
                    }
                    yielded.add(item);
                    $yield.push(item);
                }
                return Bridge.Array.toEnumerable($yield);
            },
            $length: function (point) {
                return Math.sqrt(point.x * point.x + point.y * point.y);
            }
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.Poop', {
        statics: {
            RequiredUpdatesToAnimate: 5
        },
        moveSpeed: 1.0,
        state: 0,
        updatesSinceLastAnimation: 5,
        currentAnimationFrame: 0,
        caption: null,
        random: null,
        animationTextures: null,
        captions: null,
        config: {
            properties: {
                Target: null,
                OnExit: null,
                Sprite: null
            },
            init: function () {
                this.random = new Bridge.Random("constructor");
                this.animationTextures = Bridge.merge(new Bridge.List$1(PIXI.Texture)(), [
        [PIXI.Texture.fromImage("assets/Poop_0.png")],
        [PIXI.Texture.fromImage("assets/Poop_1.png")],
        [PIXI.Texture.fromImage("assets/Poop_2.png")],
        [PIXI.Texture.fromImage("assets/Poop_3.png")]
    ] );
                this.captions = Bridge.merge(new Bridge.List$1(String)(), [
        ["YAY!"],
        ["FREEDOM!"],
        ["OH BOY!"],
        ["I'LL BE BACK!"],
        ["FOR THE KING!"],
        ["( ͡° ͜ʖ ͡°)"]
    ] );
            }
        },
        constructor: function (position) {
            this.setSprite(PIXI.Sprite.fromImage("assets/Poop_0.png"));
            this.getSprite().position = position;
            this.getSprite().scale = new PIXI.Point(0.0, 0.0);
            this.getSprite().anchor = new PIXI.Point(0.5, 0.5);
        },
        update: function () {
            if (!Bridge.hasValue(this.caption)) {
                var randomValue = this.random.next$1(500);
                if (randomValue === 499) {
                    var text = this.captions.getItem(this.random.next$1(this.captions.getCount()));
                    this.caption = new PIXI.Text(text, { stroke: this.random.next$1(2147483647) });
                    this.caption.position = new PIXI.Point(-0.2 * (this.getSprite().width + this.caption.width), -0.5 * (this.getSprite().height + this.caption.height));
                    this.getSprite().addChild(this.caption);
                }
            }
            switch (this.state) {
                case ShoopDaPoop.Application.PoopState.spawning: 
                    if (this.getSprite().scale.x < 1.0) {
                        this.getSprite().scale = ShoopDaPoop.Application.PointExtensions.add(this.getSprite().scale, new PIXI.Point(0.1, 0.1));
                    }
                    else  {
                        this.state = ShoopDaPoop.Application.PoopState.falling;
                    }
                    break;
                case ShoopDaPoop.Application.PoopState.falling: 
                    var differenceToTarget = ShoopDaPoop.Application.PointExtensions.subtract(this.getTarget(), this.getSprite().position);
                    if (Math.abs(differenceToTarget.x) < this.moveSpeed && Math.abs(differenceToTarget.y) < this.moveSpeed) {
                        this.getSprite().position = this.getTarget();
                        this.state = ShoopDaPoop.Application.PoopState.running;
                    }
                    else  {
                        ShoopDaPoop.Application.PointExtensions.normalize(differenceToTarget);
                        this.getSprite().position = ShoopDaPoop.Application.PointExtensions.add(this.getSprite().position, ShoopDaPoop.Application.PointExtensions.multiply(differenceToTarget, this.moveSpeed));
                    }
                    break;
                case ShoopDaPoop.Application.PoopState.running: 
                    this.getSprite().position = ShoopDaPoop.Application.PointExtensions.add(this.getSprite().position, ShoopDaPoop.Application.PointExtensions.multiply(new PIXI.Point(-1, 0), this.moveSpeed));
                    if (Bridge.identity(this.updatesSinceLastAnimation, (this.updatesSinceLastAnimation = (this.updatesSinceLastAnimation + 1) | 0)) >= ShoopDaPoop.Application.Poop.RequiredUpdatesToAnimate) {
                        this.updatesSinceLastAnimation = 0;
                        this.currentAnimationFrame = (this.currentAnimationFrame + 1) | 0;
                        if (this.currentAnimationFrame === this.animationTextures.getCount()) {
                            this.currentAnimationFrame = 0;
                        }
                        this.getSprite().texture = this.animationTextures.getItem(this.currentAnimationFrame);
                    }
                    if (this.getSprite().position.x < -100) {
                        this.getOnExit()();
                    }
                    break;
                default: 
                    throw new Bridge.ArgumentOutOfRangeException();
            }
    
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.PoopState', {
        statics: {
            spawning: 0,
            falling: 1,
            running: 2
        },
        $enum: true
    });
    
    Bridge.define('ShoopDaPoop.Application.ShiftType', {
        statics: {
            back: 0,
            forward: 1
        },
        $enum: true
    });
    
    Bridge.define('ShoopDaPoop.Application.Side', {
        statics: {
            left: 0,
            right: 1,
            top: 2,
            bottom: 3
        },
        $enum: true
    });
    
    Bridge.define('ShoopDaPoop.Application.TextScreen', {
        graphics: null,
        shiaOnScreen: false,
        updatesSinceVisible: 0,
        shiaHint: null,
        content: null,
        onFadeOut: null,
        config: {
            properties: {
                Container: null,
                CurrentState: 0
            },
            init: function () {
                this.content = new PIXI.Container();
            }
        },
        constructor: function (visible) {
            if (visible === void 0) { visible = true; }
    
            this.setContainer(Bridge.merge(new PIXI.Container(), {
                alpha: visible ? 1.0 : 0.0
            } ));
            this.setCurrentState(visible ? ShoopDaPoop.Application.TextScreen.State.visible : ShoopDaPoop.Application.TextScreen.State.invisible);
            this.graphics = new PIXI.Graphics();
            this.getContainer().addChild(this.graphics);
            this.getContainer().addChild(this.content);
        },
        loadGameOver: function () {
            var firstLine = this.getText("Good job, my friend!");
            firstLine.position = new PIXI.Point(300, 25);
            var secondLine = this.getText("after THAT MUCH effort");
            secondLine.position = new PIXI.Point(300, 75);
            var thirdLine = this.getText("You've got best body in");
            thirdLine.position = new PIXI.Point(300, 125);
            var preFourthLine = this.getText("THE WORLD (time stops)");
            preFourthLine.position = new PIXI.Point(300, 175);
            var fourthLine = this.getText("YOU JUST DID IT!");
            fourthLine.position = new PIXI.Point(300, 225);
            this.content.addChild(firstLine);
            this.content.addChild(secondLine);
            this.content.addChild(thirdLine);
            this.content.addChild(preFourthLine);
            this.content.addChild(fourthLine);
            this.loadShia(false, "That's it");
        },
        loadPreLevelScreen: function (level) {
            var firstLine = this.getText("Good job, my friend!");
            firstLine.position = new PIXI.Point(300, 25);
            var secondLine = this.getText("but " + 1 + " year" + (level === 1 ? "" : "s") + " later");
            secondLine.position = new PIXI.Point(300, 75);
            var thirdLine = this.getText("You've got even MORE FAT");
            thirdLine.position = new PIXI.Point(300, 125);
            var fourthLine = this.getText("JUST DO IT! AGAIN! (YES, YOU CAN!)");
            fourthLine.position = new PIXI.Point(300, 175);
            this.content.addChild(firstLine);
            this.content.addChild(secondLine);
            this.content.addChild(thirdLine);
            this.content.addChild(fourthLine);
            this.loadShia();
        },
        loadStartingScreen: function () {
            var firstLine = this.getText("You've worked hard last year");
            firstLine.position = new PIXI.Point(300, 25);
            var secondLine = this.getText("to get FAT (shame on you)");
            secondLine.position = new PIXI.Point(300, 75);
            var thirdLine = this.getText("It's time to get in SHAPE before summer");
            thirdLine.position = new PIXI.Point(300, 125);
            var fourthLine = this.getText("JUST DO IT! (YES, YOU CAN!)");
            fourthLine.position = new PIXI.Point(300, 175);
            this.content.addChild(firstLine);
            this.content.addChild(secondLine);
            this.content.addChild(thirdLine);
            this.content.addChild(fourthLine);
            this.loadShia();
        },
        loadShia: function (interactive, hint) {
            if (interactive === void 0) { interactive = true; }
            if (hint === void 0) { hint = "Click me ->"; }
            var shia = PIXI.Sprite.fromImage("assets/Shia.png");
            shia.anchor = new PIXI.Point(0.5, 0.0);
            shia.position = new PIXI.Point(300, 310);
            shia.interactive = interactive;
            shia.once('mousedown', this.shiaClicked(shia)).once('touchstart', this.shiaClicked(shia));
            this.content.addChild(shia);
            this.shiaOnScreen = true;
            this.shiaHint = this.getText(hint);
            this.shiaHint.position = new PIXI.Point(150, 450);
            this.shiaHint.visible = false;
            this.content.addChild(this.shiaHint);
        },
        shiaClicked: function (shia) {
            return Bridge.fn.bind(this, function (e) {
                shia.interactive = false;
                this.fadeOut();
                this.shiaOnScreen = false;
                if (Bridge.hasValue(this.onFadeOut)) {
                    this.onFadeOut();
                }
            });
        },
        getText: function (text) {
            return Bridge.merge(new PIXI.Text(text, { fill: "white", align: "center" }), {
                anchor: new PIXI.Point(0.5, 0)
            } );
        },
        fadeIn: function () {
            this.setCurrentState(ShoopDaPoop.Application.TextScreen.State.fadeIn);
        },
        fadeOut: function () {
            this.setCurrentState(ShoopDaPoop.Application.TextScreen.State.fadeOut);
        },
        update: function () {
            var $t, $t1;
            switch (this.getCurrentState()) {
                case ShoopDaPoop.Application.TextScreen.State.fadeIn: 
                    $t = this.getContainer();
                    $t.alpha += 0.01;
                    if (this.getContainer().alpha >= 1.0) {
                        this.setCurrentState(ShoopDaPoop.Application.TextScreen.State.visible);
                        this.updatesSinceVisible = 0;
                        this.getContainer().alpha = 1.0;
                    }
                    break;
                case ShoopDaPoop.Application.TextScreen.State.fadeOut: 
                    $t1 = this.getContainer();
                    $t1.alpha -= 0.01;
                    if (this.getContainer().alpha <= 0.0) {
                        this.setCurrentState(ShoopDaPoop.Application.TextScreen.State.invisible);
                        this.getContainer().alpha = 0.0;
                        this.content.removeChildren();
                        this.shiaHint = null;
                    }
                    break;
                case ShoopDaPoop.Application.TextScreen.State.visible: 
                    this.updatesSinceVisible = (this.updatesSinceVisible + 1) | 0;
                    if (this.updatesSinceVisible > 180 && this.shiaOnScreen) {
                        this.shiaHint.visible = true;
                    }
                    break;
            }
            this.graphics.clear().beginFill(3355443).drawRect(0, 0, 600, 600).endFill();
    
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.TextScreen.State', {
        statics: {
            fadeIn: 0,
            fadeOut: 1,
            visible: 2,
            invisible: 3
        },
        $enum: true
    });
    
    Bridge.define('ShoopDaPoop.Application.CocaCola', {
        inherits: [ShoopDaPoop.Application.Item],
        constructor: function () {
            ShoopDaPoop.Application.Item.prototype.$constructor.call(this, PIXI.Texture.fromImage("assets/CocaCola.png"));
    
    
        },
        getType: function () {
            return ShoopDaPoop.Application.ItemType.square;
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.Fish', {
        inherits: [ShoopDaPoop.Application.Item],
        constructor: function () {
            ShoopDaPoop.Application.Item.prototype.$constructor.call(this, PIXI.Texture.fromImage("assets/Fish.png"));
    
    
        },
        getType: function () {
            return ShoopDaPoop.Application.ItemType.circle;
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.God', {
        inherits: [ShoopDaPoop.Application.Item],
        constructor: function () {
            ShoopDaPoop.Application.Item.prototype.$constructor.call(this, PIXI.Texture.fromImage("assets/God.png"));
    
    
        },
        getType: function () {
            return ShoopDaPoop.Application.ItemType.circle;
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.Pizza', {
        inherits: [ShoopDaPoop.Application.Item],
        constructor: function () {
            ShoopDaPoop.Application.Item.prototype.$constructor.call(this, PIXI.Texture.fromImage("assets/Pizza.png"));
    
    
        },
        getType: function () {
            return ShoopDaPoop.Application.ItemType.diamond;
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.PortalGun', {
        inherits: [ShoopDaPoop.Application.Item],
        constructor: function () {
            ShoopDaPoop.Application.Item.prototype.$constructor.call(this, PIXI.Texture.fromImage("assets/PortalGun.png"));
    
    
        },
        getType: function () {
            return ShoopDaPoop.Application.ItemType.snake;
        }
    });
    
    Bridge.define('ShoopDaPoop.Application.Snickers', {
        inherits: [ShoopDaPoop.Application.Item],
        constructor: function () {
            ShoopDaPoop.Application.Item.prototype.$constructor.call(this, PIXI.Texture.fromImage("assets/Snickers.png"));
    
    
        },
        getType: function () {
            return ShoopDaPoop.Application.ItemType.circle;
        }
    });
    
    Bridge.init();
})(this);
