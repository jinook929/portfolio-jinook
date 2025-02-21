"use client";

import { useState, useEffect } from "react";
import { selectAll } from 'd3-selection';
import { descending } from 'd3-array';
import styles from "./Cursor.module.scss";
import localFont from 'next/font/local'

const audiowideFont = localFont({ src: '../fonts/Audiowide-Regular.ttf' })

class CursorComponent {
  constructor(isTouchDevices) {
    this.container = document.querySelector(`.cursor-container`);
    this.isTouchDevices = isTouchDevices;
    this.boundsLinks = {
      x: 613.3125,
      y: 56.6953125,
      width: 135.0625,
      height: 18,
      top: 56.6953125,
      right: 748.375,
      bottom: 74.6953125,
      left: 613.3125,
    };
    this.xStart = isTouchDevices ? 50 : this.boundsLinks.left  * 1.5 + this.boundsLinks.width;
    this.yStart = isTouchDevices ? 50 : this.boundsLinks.top  * 1.5 + this.boundsLinks.height;
    this.mouse = { x: this.xStart, y: this.yStart };
    this.pos = { x: this.xStart, y: this.yStart };
    this.diff = { x: null, y: null };
    this.tinyCursor = true;
    this.transitionParticles = false;
    this.cursor = false;
    this.mousemoveCursor();
    window.addEventListener("resize", (e) => this.init());

    this.speed = !isTouchDevices ? 0.5 : 1;
    this.delta = !isTouchDevices ? 0.04 : 0.04;
    this.cursor = true;
    this.tinyCursor = false;
    this.init();
    this.loop();
  }

  mousemoveCursor() {
    window.addEventListener(
      this.isTouchDevices ? "touchmove" : "mousemove",
      (e) => {
        this.updateCoordinates(e);
      },
      { passive: true }
    );
  }

  updateCoordinates(e) {
    this.mouse.x = e.type.match("mouse") ? e.clientX : e.touches[0].clientX;
    this.mouse.y = e.type.match("mouse") ? e.clientY : e.touches[0].clientY;
  }

  setParamsDiffs() {
    this.diff.x = this.mouse.x - this.pos.x;
    this.diff.y = this.mouse.y - this.pos.y;
    this.pos.x += this.diff.x * this.speed;
    this.pos.y += this.diff.y * this.speed;
  }

  init() {
    if (this.tinyCursor) this.setParamsCursor();
    this.setParamsParticles();
    this.drawCursor();
  }

  loop() {
    this.setParamsDiffs();
    if (this.tinyCursor) this.setTinyCursor();
    this.setParticles();
    requestAnimationFrame(() => this.loop());
  }

  drawCursor() {
    this.widthContainer = window.innerWidth;
    this.heightContainer = window.innerHeight;
    this.container.innerHTML = `<svg
        width="${this.widthContainer}"
        height="${this.heightContainer}"
        viewbox="0 0 ${this.widthContainer} ${this.heightContainer}"
        preserveAspectRatio="${this.preserveAspectRatio || "none"}"
        style="background:${this.backColor || "none"}; cursor:${
      this.cursor ? "default" : "none"
    };">
        ${this.gradientParticles ? this.drawGradient() : ""}
        ${this.maskCursor ? this.drawMaskCursor() : this.drawParticles()}
        ${this.drawTinyCursor()}
    </svg>`;
    this.svg = this.container.querySelector("svg");
    if (this.tinyCursor) {
      this.nodeCursors = this.container.querySelectorAll(".tiny-cursor circle");
    }
    this.particles = Array.from(
      this.container.querySelectorAll(".particles circle")
    );
    if (this.sorting === "desc") this.sortParticles();
    this.points = Array(this.nbrParticles)
      .fill()
      .map((el, i) => {
        return {
          node: this.particles[i],
          x: this.pos.x,
          y: this.pos.y,
        };
      });
  }

  drawTinyCursor() {
    return `${
      this.tinyCursor
        ? `<g class="tiny-cursor">
        <circle
          r=${this.radiusCursorBack || 7}
          cx=${this.pos.x}
          cy=${this.pos.y}
          fill="${this.fillCursorBack || "none"}"
          fill-opacity="${this.fillOpacityCursorBack || 1}"
          stroke="${this.strokeColorCursorBack || "none"}"
          stroke-width="${this.strokeWidthCursorBack || 1}"
          stroke-opacity="${this.strokeOpacityCursorBack || 1}"
          style="transform-origin: ${this.pos.x}px ${this.pos.y}px">
        </circle>
        <circle
          r=${this.radiusCursor || 7}
          cx=${this.pos.x}
          cy=${this.pos.y}
          fill="${this.fillCursor || "white"}"
          fill-opacity="${this.fillOpacityCursor || 1}"
          stroke="${this.strokeColorCursor || "none"}"
          stroke-width="${this.strokeWidthCursor || 0}"
          stroke-opacity="${this.strokeOpacityCursor || 1}"
          style="transform-origin: ${this.pos.x}px ${this.pos.y}px">
        </circle>
     </g>`
        : ""
    }`;
  }

  setTinyCursor() {
    this.rotate = `rotate(${
      (Math.atan2(this.diff.y, this.diff.x) * 180) / Math.PI
    }deg)`;
    this.squeeze = Math.min(
      Math.sqrt(Math.pow(this.diff.x, 2) + Math.pow(this.diff.y, 2)) /
        this.accelerator,
      this.maxSqueeze
    );
    this.scale = `scale(${1 + this.squeeze},${1 - this.squeeze})`;
    for (const [i, tinyCursor] of this.nodeCursors.entries()) {
      tinyCursor.setAttribute("cx", this.pos.x);
      tinyCursor.setAttribute("cy", this.pos.y);
      tinyCursor.style.transformOrigin = `${this.pos.x}px ${this.pos.y}px`;
      tinyCursor.style.transform = this.rotate + this.scale;
    }
  }

  drawParticles() {
    return `<g class="particles" filter=${this.filterParticles || "none"}>
      ${(() => {
        if (this.strokeGradient) {
          return `
          <defs>
            <linearGradient id=${this.strokeGradient.idStrokeGradient} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color=${this.strokeGradient.color1} />
              <stop offset="100%" stop-color=${this.strokeGradient.color2} />
            </linearGradient>
          </defs>`;
        }
      })()}
      ${Array(this.nbrParticles)
        .fill()
        .map(
          (_, i) =>
            `<circle
          r="${this.setRadiusParticles(i)}"
          cx=${this.pos.x} cy=${this.pos.y}
          fill="${this.fillParticles || "none"}"
          fill-opacity="${this.fillOpacityParticles || 1}"
          stroke="${
            this.strokeGradient
              ? `url(#${this.strokeGradient.idStrokeGradient})`
              : this.strokeColorParticles
          }"
          stroke-width="${this.strokeWidthParticles || 0}"
          stroke-opacity="${this.strokeOpacityParticles || 1}"
          id="${i}">
        </circle>`
        )
        .join("")}
    </g>`;
  }

  setParticles() {
    if (this.transitionParticles) {
      for (const [i, particle] of this.particles.entries()) {
        particle.setAttribute("cx", this.pos.x);
        particle.setAttribute("cy", this.pos.y);
        particle.style.transitionProperty = "cx,cy";
        particle.style.transitionDuration = `${
          this.transitionParticles.duration + i * this.transitionParticles.delay
        }ms `;
        particle.style.transitionTimingFunction =
          this.transitionParticles.easing;
      }
    } else {
      this.posTrail = { x: this.pos.x, y: this.pos.y };
      for (const [i, point] of this.points.entries()) {
        this.nextParticle = this.points[i + 1] || this.points[0];
        point.x = this.posTrail.x;
        point.y = this.posTrail.y;
        point.node.setAttribute("cx", this.posTrail.x);
        point.node.setAttribute("cy", this.posTrail.y);
        this.posTrail.x +=
          (this.nextParticle.x - point.x) * (this.delta || 0.9);
        this.posTrail.y +=
          (this.nextParticle.y - point.y) * (this.delta || 0.9);
      }
    }
  }

  sortParticles() {
    this.particlesD3 = selectAll(this.particles);
    this.particlesD3.data(
      this.particlesD3._groups[0].map((particle) => {
        return Number(particle.id);
      })
    );
    this.particlesD3.sort(descending);
  }

  setRadiusParticles(i) {
    this.radius = null;
    if (this.directionRadius === ">") {
      this.radius = this.radiusStart - i * this.radiusDiff;
    } else {
      this.radius = this.radiusStart + i * this.radiusDiff;
    }
    this.radius > 0 ? (this.radius = this.radius) : (this.radius = 0);
    return this.radius;
  }

  diagonalWindow() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    return Math.ceil(
      Math.sqrt(this.width * this.width + this.height * this.height)
    );
  }

  setParamsParticles() {
    this.nbrParticles = !this.isTouchDevices ? 800 : 300;
    this.radiusStart = this.diagonalWindow() / 12;
    this.radiusDiff = 0;
    this.sorting = "desc";
    this.idGradient = "gradient";
    this.fillParticles = `url('#${this.idGradient}')`;
    this.gradientParticles = {
      color1: "#ef476f",
      color2: "#ffd166",
    };
  }

  drawGradient() {
    return `<defs>
      <linearGradient id=${this.idGradient}>
        <stop offset="0%"  stop-color="${this.gradientParticles.color1}" />
        <stop offset="100%" stop-color="${this.gradientParticles.color2}" />
      </linearGradient>
    </defs>`;
  }
}
const Cursor = () => {
  const [isTouchDevices, setIsTouchDevices] = useState(false);

  useEffect(() => {
    setIsTouchDevices(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
    );

    const isTouch =  "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

    const vhDevices = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    const utils = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
          vhDevices();
          window.addEventListener("resize", () => {
            vhDevices();
          });
        }, 10);
      });

    (async () => {
      await utils();
      new CursorComponent(isTouch);
    })();
  }, [isTouchDevices]);

  return (
    <div className={styles.Container}>
      <div className={styles.Box}></div>
      <div
        className={`cursor-container ${styles.Animation}`}
        role="main"
      ></div>
    </div>
  );
};

export default Cursor;
