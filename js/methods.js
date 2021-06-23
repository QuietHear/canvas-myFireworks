// 检测数据类型
let getType = (obj) => {
    let toString = Object.prototype.toString,
        map = {
            '[object Boolean]': 'boolean',
            '[object Number]': 'number',
            '[object String]': 'string',
            '[object Function]': 'function',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object RegExp]': 'regExp',
            '[object Undefined]': 'undefined',
            '[object Null]': 'null',
            '[object Object]': 'object'
        };
    if (obj instanceof Element) {
        return 'element';
    }
    return map[toString.call(obj)];
};

// 深度拷贝
let deepCopy = (data) => {
    let type = getType(data),
        obj;
    if (type === 'array') {
        obj = [];
    }
    else if (type === 'object') {
        obj = {};
    }
    else {
        return data;
    }
    if (type === 'array') {
        for (let i = 0, len = data.length; i < len; i++) {
            obj.push(deepCopy(data[i]));
        }
    }
    else if (type === 'object') {
        for (let key in data) {
            obj[key] = deepCopy(data[key]);
        }
    }
    return obj;
};

let change_quiescence = (params, animate_params) => {
    let _default = {vx: 0, vy: 0, pal: 0, scale: 0};
    if (getType(params.x) != 'number' || getType(params.y) != 'number' || getType(params.deg) != 'number' && getType(params.deg) != 'undefined' || getType(params.zoom) != 'number') {
        return {};
    }
    let vx = getType(animate_params.vx) != 'number' ? _default.vx : animate_params.vx,
        vy = getType(animate_params.vy) != 'number' ? _default.vy : animate_params.vy,
        pal = getType(animate_params.pal) != 'number' ? _default.pal : animate_params.pal,
        scale = getType(animate_params.scale) != 'number' ? _default.scale : animate_params.scale;
    params.x += vx;
    params.y += vy;
    params.deg += pal;
    params.zoom += scale;
    return params;
};

let translate_animate_state = (animate_params, translate_params) => {
    let _default = {ax: 0, ay: 0, apal: 0, ascale: 0};
    if (getType(animate_params.vx) != 'number' || getType(animate_params.vy) != 'number' || getType(animate_params.pal) != 'number' || getType(animate_params.scale) != 'number') {
        return {};
    }
    let ax = getType(translate_params.ax) != 'number' ? _default.ax : translate_params.ax,
        ay = getType(translate_params.ay) != 'number' ? _default.ay : translate_params.ay,
        apal = getType(translate_params.apal) != 'number' ? _default.apal : translate_params.apal,
        ascale = getType(translate_params.ascale) != 'number' ? _default.ascale : translate_params.ascale;
    animate_params.vx += ax;
    animate_params.vy += ay;
    animate_params.pal += apal;
    animate_params.scale += ascale;
    return animate_params;
};

// 生成随机颜色
let randomColor = () => {
    let r = Math.floor(Math.random() * 256),
        g = Math.floor(Math.random() * 256),
        b = Math.floor(Math.random() * 256),
        color = 'rgb($r, $g, $b)';
    color = color.replace('$r', r);
    color = color.replace('$g', g);
    color = color.replace('$b', b);
    return color;
};

let Firework = {
    getInstance: () => {
        let firework = {},
            num = 100,
            beforeBalst = BeforeBalst.getInstance(),
            inBalst = InBalst.getInstance(),
            afterBalst = AfterBalst.getInstance(),
            afterBalstList = [],
            status = 0,
            fireworkType = createCircleFirework,
            resistance = 0.1,
            roundness = 1,
            delay = 0,
            ctx = {};
        firework.setBeforeBalst = (_beforeBalst) => {
            beforeBalst.setAnimate(_beforeBalst);
        };
        firework.getBeforeBalst = () => {
            return beforeBalst;
        };
        firework.setInBalst = (_inBalst) => {
            inBalst.setAnimate(_inBalst);
        };
        firework.getInBalst = () => {
            return inBalst;
        };
        firework.setAfterBalst = (_afterBalst) => {
            afterBalst.setAnimate(_afterBalst);
        };
        firework.getAfterBalst = () => {
            return afterBalst;
        };
        firework.setAfterBalstList = (_afterBalstList) => {
            afterBalstList = _afterBalstList;
        };
        firework.getAfterBalstList = () => {
            return afterBalstList;
        };
        firework.setCtx = (_ctx) => {
            ctx = _ctx;
        };
        firework.getCtx = () => {
            return ctx;
        };
        firework.setStatus = (_status) => {
            status = _status;
        };
        firework.getStatus = () => {
            return status;
        };
        firework.setRoundness = (_roundness) => {
            roundness = _roundness;
        };
        firework.getRoundness = () => {
            return roundness;
        };
        firework.setResistance = (_resistance) => {
            resistance = _resistance;
        };
        firework.getResistance = () => {
            return resistance;
        };
        firework.setNum = (_num) => {
            num = _num;
        };
        firework.getNum = () => {
            return num;
        };
        firework.setDelay = (_delay) => {
            delay = _delay;
        };
        firework.getDelay = () => {
            return delay;
        };
        firework.setFireworkType = (_fireworkType) => {
            fireworkType = _fireworkType;
        };
        firework.getFireworkType = () => {
            return fireworkType;
        };
        firework.draw = () => {
            if (status === 2) {
                ctx.beginPath();
                ctx.arc(beforeBalst.getAnimate().getQuiescence().x, beforeBalst.getAnimate().getQuiescence().y, beforeBalst.getR(), 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = beforeBalst.getColor();
                ctx.fill();
            }
            else if (status === 3) {
                let x = inBalst.getAnimate().getQuiescence().x,
                    y = inBalst.getAnimate().getQuiescence().y,
                    r = inBalst.getR(),
                    color = inBalst.getColor(),
                    alpha = inBalst.getAlpha(),
                    gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
                gradient.addColorStop(0, '#FFFFFF');
                gradient.addColorStop(0.2, color);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.globalAlpha = alpha;
                ctx.fillStyle = gradient;
                ctx.fillRect(x - r, y - r, r * 2, r * 2);
            }
            else if (status === 4) {
                for (let i = 0; i < afterBalstList.length; i++) {
                    let afterBalstCopy = afterBalstList[i],
                        animate = afterBalstCopy.getAnimate(),
                        x = animate.getQuiescence().x,
                        y = animate.getQuiescence().y,
                        r = afterBalstCopy.getR(),
                        color = afterBalstCopy.getColor(),
                        alpha = afterBalstCopy.getDelay() > 0 ? 0 : afterBalstCopy.getAlpha();
                    ctx.beginPath();
                    ctx.globalAlpha = alpha;
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }
        };
        firework.update = () => {
            if (status === 1) {
                delay--;
                if (delay <= 0) {
                    status = 2;
                }
            }
            else if (status === 2) {
                let animate = beforeBalst.getAnimate(),
                    move = animate.getMove(),
                    quiescence = animate.getQuiescence(),
                    translate = animate.getTranslate(),
                    life = beforeBalst.getLife();
                translate_animate_state(move, translate);
                change_quiescence(quiescence, move);
                beforeBalst.setLife(--life);
                if (life <= 0) {
                    status = 3;
                    inBalst.setLife(1);
                    inBalst.setColor("#FFFFFF");
                    inBalst.setR(400);
                    inBalst.setAlpha(0.4);
                    inBalst.setAnimate({quiescence: {x: quiescence.x, y: quiescence.y}});
                }
            }
            else if (status === 3) {
                let life = inBalst.getLife();
                inBalst.setLife(--life);
                if (life <= 0) {
                    status = 4;
                    fireworkType(firework);
                }
            }
            else if (status === 4) {
                for (let i = afterBalstList.length - 1; i >= 0; i--) {
                    let _afterBalst = afterBalstList[i],
                        animate = _afterBalst.getAnimate(),
                        quiescence = animate.getQuiescence(),
                        move = animate.getMove(),
                        translate = animate.getTranslate(),
                        life = _afterBalst.getLife(),
                        base = _afterBalst.getBase(),
                        custom_g = _afterBalst.getCustomG(),
                        _delay = _afterBalst.getDelay();
                    if (_delay <= 0) {
                        translate.ax = -move.vx * resistance;
                        translate.ay = (getType(custom_g) === "number" ? custom_g : g) - move.vy * resistance;
                        if (Math.abs(translate.ay) < Math.pow(10, -8)) {
                            translate.ay = 0;
                        }
                        if (Math.abs(translate.ax) < Math.pow(10, -8)) {
                            translate.ax = 0;
                        }
                        translate_animate_state(move, translate);
                        change_quiescence(quiescence, move);
                        _afterBalst.setLife(--life);
                        _afterBalst.setAlpha(0.2 + life / base.life * base.alpha);
                        if (life <= 0) {
                            afterBalstList.splice(i, 1);
                        }
                        if (afterBalstList.length === 0) {
                            status = 5;
                        }
                    }
                    else {
                        _afterBalst.setDelay(--_delay);
                    }
                }
            }
        };
        return firework;
    }
};

let BeforeBalst = {
    getInstance: () => {
        let beforeBalst = {},
            animate = Animate.getInstance(),
            r = 0,
            life = 0,
            color = "#000000",
            base = {};
        beforeBalst.setAnimate = (_beforeBalst) => {
            let quiescence = getType(_beforeBalst.quiescence) === 'object' ? _beforeBalst.quiescence : {},
                move = getType(_beforeBalst.move) === 'object' ? _beforeBalst.move : {},
                translate = getType(_beforeBalst.translate) === 'object' ? _beforeBalst.translate : {};
            animate.setQuiescence(quiescence);
            animate.setMove(move);
            animate.setTranslate(translate);
        };
        beforeBalst.getAnimate = () => {
            return animate;
        };
        beforeBalst.setR = (_r) => {
            r = _r;
        };
        beforeBalst.getR = () => {
            return r;
        };
        beforeBalst.setColor = (_color) => {
            color = _color;
        };
        beforeBalst.getColor = () => {
            return color;
        };
        beforeBalst.setLife = (_life) => {
            life = _life;
        };
        beforeBalst.getLife = () => {
            return life;
        };
        beforeBalst.setBase = () => {
            base.animate = {
                quiescence: deepCopy(beforeBalst.getAnimate().getQuiescence()),
                move: deepCopy(beforeBalst.getAnimate().getMove()),
                translate: deepCopy(beforeBalst.getAnimate().getTranslate())
            };
            base.r = r;
            base.color = color;
            base.life = life;
        };
        beforeBalst.getBase = () => {
            return base;
        };
        return beforeBalst;
    }
};

let InBalst = {
    getInstance: () => {
        let inBalst = {},
            animate = Animate.getInstance(),
            r = 0,
            color = "#000000",
            life = 0,
            alpha = 0.25;
        inBalst.setAnimate = (_inBalst) => {
            let quiescence = getType(_inBalst.quiescence) === 'object' ? _inBalst.quiescence : {},
                move = getType(_inBalst.move) === 'object' ? _inBalst.move : {},
                translate = getType(_inBalst.translate) === 'object' ? _inBalst.translate : {};
            animate.setQuiescence(quiescence);
            animate.setMove(move);
            animate.setTranslate(translate);
        };
        inBalst.getAnimate = () => {
            return animate;
        };
        inBalst.setR = (_r) => {
            r = _r;
        };
        inBalst.getR = () => {
            return r;
        };
        inBalst.setAlpha = (_alpha) => {
            alpha = _alpha > 1 ? 1 : (_alpha < 0 ? 0 : _alpha);
        };
        inBalst.getAlpha = () => {
            return alpha;
        };
        inBalst.setColor = (_color) => {
            color = _color;
        };
        inBalst.getColor = () => {
            return color;
        };
        inBalst.setLife = (_life) => {
            life = _life;
        };
        inBalst.getLife = () => {
            return life;
        };
        return inBalst;
    }
};

let AfterBalst = {
    getInstance: () => {
        let afterBalst = {},
            animate = Animate.getInstance(),
            base = {},
            alpha = 1,
            r = 0,
            color = "#FFFFFF",
            life = 0,
            delay = 0,
            custom_g = null;
        afterBalst.setBase = () => {
            base.life = life;
            base.alpha = alpha;
        };
        afterBalst.getBase = () => {
            return base;
        };
        afterBalst.setAnimate = (_afterBalst) => {
            let quiescence = getType(_afterBalst.quiescence) === 'object' ? _afterBalst.quiescence : {},
                move = getType(_afterBalst.move) === 'object' ? _afterBalst.move : {},
                translate = getType(_afterBalst.translate) === 'object' ? _afterBalst.translate : {};
            animate.setQuiescence(quiescence);
            animate.setMove(move);
            animate.setTranslate(translate);
        };
        afterBalst.getAnimate = () => {
            return animate;
        };
        afterBalst.setAlpha = (_alpha) => {
            alpha = _alpha > 1 ? 1 : (_alpha < 0 ? 0 : _alpha);
        };
        afterBalst.getAlpha = () => {
            return alpha;
        };
        afterBalst.setR = (_r) => {
            r = _r;
        };
        afterBalst.getR = () => {
            return r;
        };
        afterBalst.setDelay = (_delay) => {
            delay = _delay;
        };
        afterBalst.getDelay = () => {
            return delay;
        };
        afterBalst.setCustomG = (_customG) => {
            custom_g = _customG;
        };
        afterBalst.getCustomG = () => {
            return custom_g;
        };
        afterBalst.setColor = (_color) => {
            color = _color;
        };
        afterBalst.getColor = () => {
            return color;
        };
        afterBalst.setLife = (_life) => {
            life = _life;
        };
        afterBalst.getLife = () => {
            return life;
        };
        return afterBalst;
    }
};

let Animate = {
    getInstance: () => {
        let animate = {},
            quiescence = {x: 0, y: 0, deg: 0, zoom: 1},
            move = {vx: 0, vy: 0, pal: 0, scale: 0},
            translate = {ax: 0, ay: 0, apal: 0, ascale: 0};
        animate.setQuiescence = (_quiescence) => {
            quiescence.x = getType(_quiescence.x) != 'number' ? quiescence.x : _quiescence.x;
            quiescence.y = getType(_quiescence.y) != 'number' ? quiescence.y : _quiescence.y;
            quiescence.deg = getType(_quiescence.deg) != 'number' ? quiescence.deg : _quiescence.deg;
            quiescence.zoom = getType(_quiescence.zoom) != 'number' ? quiescence.zoom : _quiescence.zoom;
        };
        animate.getQuiescence = () => {
            return quiescence;
        };
        animate.setMove = (_move) => {
            move.vx = getType(_move.vx) != 'number' ? move.vx : _move.vx;
            move.vy = getType(_move.vy) != 'number' ? move.vy : _move.vy;
            move.pal = getType(_move.pal) != 'number' ? move.pal : _move.pal;
            move.scale = getType(_move.scale) != 'number' ? move.scale : _move.scale;
        };
        animate.getMove = () => {
            return move;
        };
        animate.setTranslate = (_translate) => {
            translate.ax = getType(_translate.ax) != 'number' ? translate.ax : _translate.ax;
            translate.ay = getType(_translate.ay) != 'number' ? translate.ay : _translate.ay;
            translate.apal = getType(_translate.apal) != 'number' ? translate.apal : _translate.apal;
            translate.ascale = getType(_translate.ascale) != 'number' ? translate.ascale : _translate.ascale;
        };
        animate.getTranslate = () => {
            return translate;
        };
        return animate;
    }
};

// 输出圆形烟花
let createCircleFirework = (firework) => {
    let inBalst = firework.getInBalst(),
        num = firework.getNum(),
        roundness = firework.getRoundness(),
        resistance = firework.getResistance(),
        afterBalstList = [];
    for (let i = 0; i < num; i++) {
        let afterBalstCopy = AfterBalst.getInstance(),
            degree = i * 2 * Math.PI / num,
            animate = inBalst.getAnimate(),
            quiescence = animate.getQuiescence(),
            v = 20 * (roundness + (1 - roundness) * Math.random());
        afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
        afterBalstCopy.setColor(randomColor());
        afterBalstCopy.setAlpha(1);
        afterBalstCopy.setR(2);
        afterBalstCopy.setAnimate({
            quiescence: {x: quiescence.x, y: quiescence.y},
            move: {vx: Math.cos(degree) * v, vy: Math.sin(degree) * v},
            translate: {ax: Math.cos(degree) * v * -resistance, ay: g - resistance * Math.sin(degree) * v}
        });
        afterBalstCopy.setBase();
        afterBalstList.push(afterBalstCopy);
    }
    firework.setAfterBalstList(afterBalstList);
};

// 输出心型烟花
let createHeartFirework = (firework) => {
    let inBalst = firework.getInBalst(),
        num = firework.getNum(),
        roundness = firework.getRoundness(),
        resistance = firework.getResistance(),
        afterBalstList = [];
    for (let i = 0; i < num; i++) {
        let afterBalstCopy = AfterBalst.getInstance(),
            degree = i * 2 * Math.PI / num,
            animate = inBalst.getAnimate(),
            quiescence = animate.getQuiescence(),
            v = 20 * (roundness + (1 - roundness) * Math.random());
        afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
        afterBalstCopy.setColor(randomColor());
        afterBalstCopy.setAlpha(1);
        afterBalstCopy.setR(2);
        afterBalstCopy.setAnimate({
            quiescence: {x: quiescence.x, y: quiescence.y},
            move: {
                vx: 16 * Math.pow(Math.sin(degree), 3) / 13 * v,
                vy: -(13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v
            },
            translate: {
                ax: 16 * Math.pow(Math.sin(degree), 3) / 13 * v * -resistance,
                ay: g - resistance * -(13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v
            }
        });
        afterBalstCopy.setBase();
        afterBalstList.push(afterBalstCopy);
    }
    firework.setAfterBalstList(afterBalstList);
};

// 输出穿心烟花
let createDoubleHeartFirework = (firework) => {
    let inBalst = firework.getInBalst(),
        num = firework.getNum(),
        roundness = firework.getRoundness(),
        resistance = firework.getResistance(),
        afterBalstList = [];
    for (let i = 0; i < num; i++) {
        let degree = i * 2 * Math.PI / num,
            animate = inBalst.getAnimate(),
            quiescence = animate.getQuiescence(),
            v = 20 * (roundness + (1 - roundness) * Math.random());
        if (i > num / 16 && i < num * 5 / 8) {
            let afterBalstCopy = AfterBalst.getInstance();
            afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
            afterBalstCopy.setColor(randomColor());
            afterBalstCopy.setAlpha(1);
            afterBalstCopy.setR(2);
            afterBalstCopy.setAnimate({
                quiescence: {x: quiescence.x, y: quiescence.y},
                move: {
                    vx: 16 * Math.pow(Math.sin(degree), 3) / 13 * v + 20,
                    vy: -(13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v
                },
                translate: {
                    ax: (16 * Math.pow(Math.sin(degree), 3) / 13 * v + 20) * -resistance,
                    ay: g - resistance * -(13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v
                }
            });
            afterBalstCopy.setBase();
            afterBalstList.push(afterBalstCopy);
        }
        let afterBalstCopy = AfterBalst.getInstance();
        afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
        afterBalstCopy.setColor(randomColor());
        afterBalstCopy.setAlpha(1);
        afterBalstCopy.setR(2);
        afterBalstCopy.setAnimate({
            quiescence: {x: quiescence.x, y: quiescence.y},
            move: {
                vx: 16 * Math.pow(Math.sin(degree), 3) / 13 * v,
                vy: -(13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v
            },
            translate: {
                ax: 16 * Math.pow(Math.sin(degree), 3) / 13 * v * -resistance,
                ay: g - resistance * -(13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v
            }
        });
        afterBalstCopy.setBase();
        afterBalstList.push(afterBalstCopy);
    }
    num = Math.floor(num / 4);
    for (let i = 0; i < num; i++) {
        let afterBalstCopy = AfterBalst.getInstance(),
            degree = 0,
            animate = inBalst.getAnimate(),
            quiescence = animate.getQuiescence(),
            v = 20 * (roundness + (1 - roundness) * Math.random());
        afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
        afterBalstCopy.setColor(randomColor());
        afterBalstCopy.setAlpha(1);
        afterBalstCopy.setR(2);
        afterBalstCopy.setAnimate({
            quiescence: {x: quiescence.x, y: quiescence.y},
            move: {vx: Math.cos(degree) * v + 20 + 30 * i / num, vy: Math.sin(degree) * v},
            translate: {
                ax: (Math.cos(degree) * v + 20 + 30 * i / num) * -resistance,
                ay: g - resistance * Math.sin(degree) * v
            }
        });
        afterBalstCopy.setBase();
        afterBalstList.push(afterBalstCopy);
    }
    num = Math.floor(num * 4 / 3);
    for (let i = 0; i < num; i++) {
        let afterBalstCopy = AfterBalst.getInstance(),
            degree = Math.PI,
            animate = inBalst.getAnimate(),
            quiescence = animate.getQuiescence(),
            v = 20 * (roundness + (1 - roundness) * Math.random());
        afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
        afterBalstCopy.setColor(randomColor());
        afterBalstCopy.setAlpha(1);
        afterBalstCopy.setR(2);
        afterBalstCopy.setAnimate({
            quiescence: {x: quiescence.x, y: quiescence.y},
            move: {vx: Math.cos(degree) * v + 10 - 30 * i / num, vy: Math.sin(degree) * v},
            translate: {
                ax: (Math.cos(degree) * v + 10 - 30 * i / num) * -resistance,
                ay: g - resistance * Math.sin(degree) * v
            }
        });
        afterBalstCopy.setBase();
        afterBalstList.push(afterBalstCopy);
    }
    num = Math.floor(num * 12 / 5);
    for (let i = 0; i < num; i++) {
        let afterBalstCopy = AfterBalst.getInstance(),
            degree = i * 2 * Math.PI / num,
            animate = inBalst.getAnimate(),
            quiescence = animate.getQuiescence(),
            v = 20 * (roundness + (1 - roundness) * Math.random()) / 6;
        afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
        afterBalstCopy.setColor(randomColor());
        afterBalstCopy.setAlpha(1);
        afterBalstCopy.setR(2);
        afterBalstCopy.setAnimate({
            quiescence: {x: quiescence.x, y: quiescence.y},
            move: {
                vx: (13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v - 40,
                vy: 16 * Math.pow(Math.sin(degree), 3) / 13 * v
            },
            translate: {
                ax: ((13 * Math.cos(degree) - 5 * Math.cos(2 * degree) - 2 * Math.cos(3 * degree) - Math.cos(4 * degree)) / 13 * v - 40) * -resistance,
                ay: g - resistance * 16 * Math.pow(Math.sin(degree), 3) / 13 * v
            }
        });
        afterBalstCopy.setBase();
        afterBalstList.push(afterBalstCopy);
    }
    firework.setAfterBalstList(afterBalstList);
};

// 输出椭圆形烟花
let createEllipseFirework = (firework) => {
    let inBalst = firework.getInBalst(),
        num = firework.getNum(),
        roundness = firework.getRoundness(),
        resistance = firework.getResistance(),
        afterBalstList = [];
    for (let i = 0; i < num; i++) {
        let afterBalstCopy = AfterBalst.getInstance(),
            degree = i * 2 * Math.PI / num,
            animate = inBalst.getAnimate(),
            quiescence = animate.getQuiescence(),
            v = 20 * (roundness + (1 - roundness) * Math.random());
        afterBalstCopy.setLife(50 + Math.floor(Math.random() * 40));
        afterBalstCopy.setColor(randomColor());
        afterBalstCopy.setAlpha(1);
        afterBalstCopy.setR(2);
        afterBalstCopy.setAnimate({
            quiescence: {x: quiescence.x, y: quiescence.y},
            move: {
                vx: Math.cos(degree) * v * Math.cos(15 * Math.PI / 180) + Math.sin(degree) * v / 4 * Math.sin(15 * Math.PI / 180),
                vy: Math.sin(degree) * v / 4 * Math.cos(15 * Math.PI / 180) - Math.cos(degree) * v * Math.sin(15 * Math.PI / 180)
            },
            translate: {
                ax: (Math.cos(degree) * v * Math.cos(15 * Math.PI / 180) + Math.sin(degree) * v / 4 * Math.sin(15 * Math.PI / 180)) * -resistance,
                ay: g - resistance * (Math.sin(degree) * v / 4 * Math.cos(15 * Math.PI / 180) - Math.cos(degree) * v * Math.sin(15 * Math.PI / 180))
            }
        });
        afterBalstCopy.setBase();
        afterBalstList.push(afterBalstCopy);
    }
    firework.setAfterBalstList(afterBalstList);
};

// 输出文字烟花
let createCustomFirework = (firework) => {
    let inBalst = firework.getInBalst(),
        roundness = firework.getRoundness(),
        resistance = firework.getResistance(),
        animate = inBalst.getAnimate(),
        quiescence = animate.getQuiescence(),
        afterBalstList = [], custom_g = g / 10,
        denominator = 10,
        r = 1.5,
        delay = 0;
    $.each(word, function (index, value) {
        let text = word_matrix[value],
            num = text.length,
            position_x = word_position[index * 2],
            position_y = word_position[index * 2 + 1];
        for (let i = 0; i < num; i++) {
            for (let j = 0; j < 9; j++) {
                let point_x = text[i][0],
                    point_y = text[i][1];
                switch (j) {
                    case 0:
                        point_x -= 3.5 / denominator;
                        point_y -= 3.5 / denominator;
                        break;
                    case 1:
                        point_y -= 3.5 / denominator;
                        break;
                    case 2:
                        point_x += 3.5 / denominator;
                        point_y -= 3.5 / denominator;
                        break;
                    case 3:
                        point_x -= 3.5 / denominator;
                        break;
                    case 4:
                        break;
                    case 5:
                        point_x += 3.5 / denominator;
                        break;
                    case 6:
                        point_x -= 3.5 / denominator;
                        point_y += 3.5 / denominator;
                        break;
                    case 7:
                        point_y += 3.5 / denominator;
                        break;
                    case 8:
                        point_x += 3.5 / denominator;
                        point_y += 3.5 / denominator;
                        break;
                    default:
                        break;
                }
                let afterBalstCopy = AfterBalst.getInstance(),
                    range = Math.sqrt(Math.pow(point_x, 2) + Math.pow(point_y, 2)),
                    cos_degree = (range === 0) ? 0 : point_x / range,
                    sin_degree = (range === 0) ? 0 : point_y / range,
                    v = 2 * (roundness + (1 - roundness) * Math.random());
                afterBalstCopy.setDelay(delay);
                afterBalstCopy.setLife(200 + Math.floor(Math.random() * 40));
                afterBalstCopy.setColor(randomColor());
                afterBalstCopy.setAlpha(1);
                afterBalstCopy.setR(r);
                afterBalstCopy.setCustomG(custom_g);
                afterBalstCopy.setAnimate({
                    quiescence: {x: quiescence.x + position_x, y: quiescence.y + position_y},
                    move: {vx: v * range * cos_degree, vy: v * range * sin_degree},
                    translate: {
                        ax: (v * range * cos_degree) * -resistance,
                        ay: custom_g - resistance * (v * range * sin_degree)
                    }
                });
                afterBalstCopy.setBase();
                afterBalstList.push(afterBalstCopy);
            }
        }
        delay += 2;
    });
    firework.setAfterBalstList(afterBalstList);
};

//初始化一个烟火
let create = (firework, params) => {
    let beforeBalst = firework.getBeforeBalst();
    firework.setCtx(ctx);
    firework.setStatus(1);//状态为点燃引线
    firework.setNum(100 + Math.floor(20 * Math.random()));//爆炸之后的烟花数量
    firework.setRoundness(getType(params) === "object" ? (getType(params.roundness) === "number" ? params.roundness : 0.25) : 0.25);//默认的规则度是0.25,这样爆炸的烟花与真实的最像
    firework.setFireworkType(getType(params) === "object" ? params.fireworkType : fireworkTypeList[Math.floor(Math.random() * fireworkTypeList.length)]);//从三种形状中随机烟花形状
    // firework.setFireworkType(getType(params) === "object" ? params.fireworkType : createCircleFirework);//默认圆形烟花
    firework.setDelay(Math.floor(30 * Math.random()));//引线燃烧的时间,单位为帧, 最多30帧,即0.5s
    beforeBalst.setAnimate({
        quiescence: {//发射位置为底部中间
            x: canvas.width / 2,
            y: canvas.height,
            deg: 0,
            zoom: 1
        },
        move: {//发射速度向量
            vx: getType(params) === "object" && params.vx === 0 ? 0 : (($(canvas).width() < 1000 ? -4 : -7) + Math.random() * ($(canvas).width() < 1000 ? 8 : 14)),
            vy: getType(params) === "object" && params.vy.value ? params.vy.num : (($(canvas).height() > 1000 ? -25 : -21) + 4 * Math.random()),
            pal: 0,
            scale: 0
        },
        translate: {//发射加速度,有一个为g的重力加速度
            ax: 0,
            ay: g,
            apal: 0,
            scale: 0
        }
    });
    beforeBalst.setR(3);//烟火半径为3像素
    beforeBalst.setColor("#FFFFFF");//白色
    beforeBalst.setLife(50 + Math.floor(Math.random() * 50));//烟花从发射到爆炸的时间,单位为帧,即50-100帧后爆炸
    beforeBalst.setBase();//记录烟花发射的初始状态
};

//描绘每一帧烟火的状态
let draw = () => {
    //整个canvas充满黑幕,模拟黑夜
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#000003';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //描绘每个烟火的状态
    ctx.globalCompositeOperation = 'screen';
    $.each(fireworkList, function (index, value) {
        value.draw();
    });

};

//更新每一帧烟火的状态
let update = () => {
    for (let i = fireworkList.length - 1; i >= 0; i--) {
        fireworkList[i].update();//更新
        if (fireworkList[i].getStatus() === 5) {//烟火消失
            fireworkList.splice(i, 1);//在烟火集合中将这个烟火去除掉
            if (totalNum < surprise_num) {//当发射烟火数量没到25
                let firework = Firework.getInstance();//继续生成新的烟火
                create(firework);
                fireworkList.push(firework);
                totalNum++;
            }
            if (fireworkList.length === 0) {//发射生日快乐烟火和一箭穿心烟火
                if (!isEnd) {
                    if (flag) {
                        let firework = Firework.getInstance();
                        create(firework, {
                            fireworkType: createCustomFirework,
                            vx: 0,
                            vy: {value: true, num: $(canvas).height() > 1000 ? -22 : -18}, // 自己根据屏幕高度调整
                            roundness: 1
                        });
                        fireworkList.push(firework);
                        let firework2 = Firework.getInstance();
                        create(firework2, {
                            fireworkType: createDoubleHeartFirework,
                            vx: 0,
                            vy: {value: true, num: $(canvas).height() > 1000 ? -24 : -20}, // 自己根据屏幕高度调整
                            roundness: 1
                        });
                        fireworkList.push(firework2);
                    }
                    isEnd = true;
                }
                else {
                    if (infinite) {
                        setTimeout(function () {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            isEnd = false;
                            totalNum = 0;
                            begin(msg);
                        }, 300);
                    }
                    else {
                        setTimeout(function () {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            $('.delong').show();
                        }, 300);
                    }
                }
            }
        }
    }
};

// 初始绘制函数
let init = () => {
    if (fireworkList.length > 0 || !isEnd) {
        draw();
        update();
        requestAnimationFrame(init); // 每秒触发60次的方法,因此动画是60帧的
    }
};

let canvas = $("canvas")[0],
    ctx = canvas.getContext("2d"),
    g = 0.25, // 模拟重力加速度
    n = 5, // 一次性发射的烟火的数量
    fireworkList = [], // 存放所有烟火对象
    fireworkTypeList = [createCircleFirework, createEllipseFirework, createHeartFirework], // 烟火形状:圆形,椭圆形,爱心形
    totalNum = 0, // 发射烟火的总数量
    surprise_num = 25, // 当发射烟火数量达到25时,发射生日快乐字样的烟火
    flag = true, // 是否发射生日快乐字样的烟火
    isEnd = false, // 是否是结束
    infinite = false; // 是否无限循环

canvas.width = $(canvas).width();
canvas.height = $(canvas).height();

//需要输出的文字
let word = ["卢", "菲", "生", "日", "快", "乐"];

// 7个字的中心位置，2个一组[x,y]
let word_position = [-200, 0, 200, 0, -375, 250, -125, 250, 125, 250, 375, 250];

// 每个文字对应的偏移量
let word_matrix = {
    '卢':
        [
            // 上卢
            [0, -6], [0, -5], [0, -4], [0, -3], // |
            [0, -5], [1, -5], [2, -5], [3, -5], // 一
            // 下卢
            [-2.5, -2], [-1.5, -2], [-0.5, -2], [0.5, -2], [1.5, -2], [2.5, -2], // 一
            [2.5, -1], [2.5, 0], // |
            [-2.5, 1], [-1.5, 1], [-0.5, 1], [0.5, 1], [1.5, 1], [2.5, 1], // 一
            [-2.5, -1], [-2.5, 0], [-2.5, 0.5], [-2.8, 1.5], [-3.1, 2.5], [-3.5, 3.5], [-4, 4], // 丿
        ],
    '菲':
        [
            // 艹
            [-3, -5], [-2, -5], [-1, -5], [0, -5], [1, -5], [2, -5], [3, -5], // 一
            [-1.5, -6], [-1.5, -5], [-1.5, -4], // |
            [1.5, -6], [1.5, -5], [1.5, -4], // |
            // 左非
            [-1, -2.5], [-1, -1.5], [-1, -0.5], [-1, 0.5], [-1, 1.5], [-1, 2.5], [-1, 3.5], // |
            [-3, -2], [-2, -2], [-1, -2], // 一
            [-3, -0.5], [-2, -0.5], [-1, -0.5], // 一
            [-3, 1], [-2, 1], [-1, 1], // 一
            // 右非
            [1, -2.5], [1, -1.5], [1, -0.5], [1, 0.5], [1, 1.5], [1, 2.5], [1, 3.5], // |
            [3, -2], [2, -2], [1, -2], // 一
            [3, -0.5], [2, -0.5], [1, -0.5], // 一
            [3, 1], [2, 1], [1, 1], // 一
        ],
    // '玲':
    //     [
    //         // 提王
    //         [-4, -2], [-3, -2], [-2, -2], // 一
    //         [-4, 1], [-3, 1], [-2, 1], // 一
    //         [-3, -1], [-3, 0], [-3, 2], [-3, 3], [-3, 4], // |
    //         [-4, 5], [-2, 3], // ╱
    //         // 人
    //         [2, -6], [2, -5], [1.5, -4], [1, -3], [0, -2], // 丿
    //         [2.5, -4], [3, -3], [4, -2], // ╰
    //         // 丶
    //         [1.5, -1.5], [2, -1], // 丶
    //         // ヌ
    //         [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], // 一
    //         [3.5, 2], [3, 3], [2.5, 4], [2, 5], // ╱
    //         [1, 4], [3, 6], // ╰
    //     ],
    '生':
        [
            [-3, -4], [-3.5, -3], [-4, -2], [-5, -1], [-6, 0], // 丿
            [-3, -2], [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2], [3, -2], // 一
            [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], // 一
            [0, -5], [0, -4], [0, -3], [0, -1], [0, 0], [0, 2], [0, 3], [0, 4], // |
            [-5, 5], [-4, 5], [-3, 5], [-2, 5], [-1, 5], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5] // 一
        ],
    '日':
        [
            [-3, -4], [-3, -3], [-3, -2], [-3, -1], [-3, 0], [-3, 1], [-3, 2], [-3, 3], [-3, 4], [-3, 5], // |
            [-2, -4], [-1, -4], [0, -4], [1, -4], [2, -4], [3, -4], // 一
            [3, -3], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], // |
            [-2, 0.5], [-1, 0.5], [0, 0.5], [1, 0.5], [2, 0.5], // 一
            [-2, 5], [-1, 5], [0, 5], [1, 5], [2, 5] // 一
        ],
    '快':
        [
            // 忄
            [-4, -5], [-4, -4], [-4, -3], [-4, -2], [-4, -1], [-4, 0], [-4, 1], [-4, 2], [-4, 3], [-4, 4], [-4, 5], // |
            [-5.5, -1], [-5.5, 0], [-6.5, 1], // ╱
            [-3, -2], [-2, -1], // 丶
            // 左开口央
            [-1, -2], [0, -2], [1, -2], [2, -2], [3, -2], [4, -2], // 一
            [4, -1], [4, 0], // |
            [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], // 一
            [1, -5], [1, -4], [1, -3], [1, -1], [1, 0], [1, 2], [0, 3], [-1, 4], [-2, 5], // 丿
            [2, 3], [3, 4], [4, 5] // ╰
        ],
    '乐':
        [
            [3, -5], [2, -4.5], [1, -4], [0, -4], [-1, -4], [-2, -4], [-3, -4], [-4, -4], // 丿
            [-4, -3], [-4, -2], [-4, -1], [-4, 0], // |
            [-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], // 一
            [0, -3], [0, -2], [0, -1], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [-1, 4.5], [-1.5, 4], // ♩
            [-2, 2], [-3, 3], [-4, 4], // ╱
            [2, 2], [3, 3], [4, 4] // 丶
        ]
};

// 初始化函数
let begin = (msg) => {
    g = msg.g !== undefined ? msg.g : g;
    n = msg.n !== undefined ? msg.n : n;
    surprise_num = msg.surprise_num !== undefined ? msg.surprise_num : surprise_num;
    flag = msg.flag !== undefined ? msg.flag : flag;
    infinite = msg.infinite !== undefined ? msg.infinite : infinite;
    for (let i = 0; i < n; i++) {//初始化n个烟火
        let firework = Firework.getInstance();
        create(firework);
        fireworkList.push(firework);
        totalNum++;
    }
    init();
};

$('.delong button').on('click', function () {
    isEnd = false;
    totalNum = 0;
    begin(msg);
    $('.delong').hide();
});