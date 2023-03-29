import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home.module.css';
import { gsap } from 'gsap';
import { Tween } from 'react-gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const inter = Inter({ subsets: ['latin'] });

class Star {
    constructor(canvas, c, speed) {
        //initializing
        this.canvas = canvas;
        this.c = c;
        this.speed = speed;
        this.x = Math.random() * this.canvas.width - this.canvas.width / 2; //random x
        this.y = Math.random() * this.canvas.height - this.canvas.height / 2; //random y
        this.px, this.py;
        this.z = Math.random() * 4; //random z
    }

    update() {
        //stores previous x, y and z and generates new coordinates
        this.px = this.x;
        this.py = this.y;
        this.z += this.speed;
        this.x += this.x * (this.speed * 0.2) * this.z;
        this.y += this.y * (this.speed * 0.2) * this.z;
        if (
            this.x > this.canvas.width / 2 + 50 ||
            this.x < -this.canvas.width / 2 - 50 ||
            this.y > this.canvas.height / 2 + 50 ||
            this.y < -this.canvas.height / 2 - 50
        ) {
            this.x = Math.random() * this.canvas.width - this.canvas.width / 2;
            this.y = Math.random() * this.canvas.height - this.canvas.height / 2;
            this.px = this.x;
            this.py = this.y;
            this.z = 0;
        }
    }
    show() {
        this.c.lineWidth = this.z;
        this.c.beginPath();
        this.c.moveTo(this.x, this.y);
        this.c.lineTo(this.px, this.py);
        this.c.stroke();
    }
}

export default function Home() {
    let c = null;
    let canvas = null;
    let stars = [];
    let reqAnimFrame = null;
    let animate = true;

    const draw = () => {
        //create rectangle
        c.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        for (let s of stars) {
            s.update();
            s.show();
        }
        if (animate) reqAnimFrame(draw);
    };

    const onVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            draw();
        } else {
            animate = false;
        }
    };

    useEffect(() => {
        reqAnimFrame =
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;
        canvas = document.getElementById('starField');
        c = canvas.getContext('2d');
        canvas.width = window.innerWidth; //screen width
        canvas.height = window.innerHeight; //screem height
        animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let speed = 0.004;
        for (let i = 0; i < 120; i++) stars.push(new Star(canvas, c, speed));
        c.fillStyle = 'rgba(0, 0, 0, 0.1)';
        c.strokeStyle = '#cfaeef'; // #cfaeef
        c.translate(canvas.width / 2, canvas.height / 2);
        document.addEventListener('visibilitychange', onVisibilityChange);
        draw();
        return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    }, []);

    return (
        <>
            <Head>
                <title>unimo.app | Experience that sparks joy.</title>
                <meta name='description' content='unimo.app | Experience that sparks joy.' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <canvas id={'starField'} className={styles.starField}></canvas>
            <div className={styles.gradientOverlay}></div>
            <main className={styles.main}>
                <section className={styles.jumboSection}>
                    <div>
                        <Image
                            className={styles.logo}
                            src={
                                'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjAiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMzAzMnB4IiBoZWlnaHQ9IjYyNXB4IiB2aWV3Qm94PSIwIDAgMzAzMiA2MjUiIGlkPSJzdmczMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcyBpZD0iZGVmczM0Ij4KICAgIDxjbGlwUGF0aCBjbGlwUGF0aFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNsaXBQYXRoMTk4Ij4KICAgICAgPHBvbHlnb24gc3Ryb2tlPSIjY2JjYmNiIiBzdHJva2Utb3BhY2l0eT0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBwb2ludHM9IjI0OTMuNTkzLDIyMi43MjYgMjUwNi40NjksMTk2LjY0OCAyNTIyLjUyNSwxNzIuODUyIDI1NDEuNTQxLDE1MS41NDcgMjU2My4yOTQsMTMyLjk0MyAyNTg3LjU2MywxMTcuMjUxIDI2MTQuMTI1LDEwNC42OCAyNjQyLjc1Nyw5NS40NCAyNjczLjIzOCw4OS43NDMgMjcwNS4zNDcsODcuNzk3IDI3MzcuNjUzLDg5Ljc0MyAyNzY4LjMsOTUuNDQgMjc5Ny4wNjgsMTA0LjY4IDI4MjMuNzM4LDExNy4yNTEgMjg0OC4wOTEsMTMyLjk0MyAyODY5LjkwOCwxNTEuNTQ3IDI4ODguOTcsMTcyLjg1MiAyOTA1LjA1NywxOTYuNjQ4IDI5MTcuOTUsMjIyLjcyNiAyOTI3LjQzMiwyNTAuODc0IDI5MzMuMjgsMjgwLjg4MyAyOTM1LjI3OSwzMTIuNTQzIDI5MzMuMjgxLDM0NC4wMjEgMjkyNy40MzIsMzczLjkxMiAyOTE3Ljk1MSw0MDEuOTk2IDI5MDUuMDU3LDQyOC4wNTQgMjg4OC45Nyw0NTEuODY2IDI4NjkuOTA4LDQ3My4yMTUgMjg0OC4wOTEsNDkxLjg4IDI4MjMuNzM5LDUwNy42NDMgMjc5Ny4wNjgsNTIwLjI4NSAyNzY4LjMsNTI5LjU4NSAyNzM3LjY1Myw1MzUuMzI3IDI3MDUuMzQ3LDUzNy4yODkgMjY3My4yMzgsNTM1LjMyNyAyNjQyLjc1Nyw1MjkuNTg1IDI2MTQuMTI1LDUyMC4yODUgMjU4Ny41NjMsNTA3LjY0MyAyNTYzLjI5NCw0OTEuODggMjU0MS41NDEsNDczLjIxNSAyNTIyLjUyNSw0NTEuODY2IDI1MDYuNDY5LDQyOC4wNTQgMjQ5My41OTMsNDAxLjk5NiAyNDg0LjEyMiwzNzMuOTEyIDI0NzguMjc2LDM0NC4wMjEgMjQ3Ni4zNzgsMzE0LjExNyAyNDc2LjI3OCwzMTIuNTQzIDI0NzguMjc2LDI4MC44ODMgMjQ4NC4xMjIsMjUwLjg3NCAiIHN0eWxlPSJkaXNwbGF5Om5vbmU7ZmlsbDojYmFkYTU1O3N0cm9rZS13aWR0aDo5cHgiIGlkPSJwb2x5Z29uMjAwIiBkPSJtIDI0OTMuNTkzLDIyMi43MjYgMTIuODc2LC0yNi4wNzggMTYuMDU2LC0yMy43OTYgMTkuMDE2LC0yMS4zMDUgMjEuNzUzLC0xOC42MDQgMjQuMjY5LC0xNS42OTIgMjYuNTYyLC0xMi41NzEgMjguNjMyLC05LjI0IDMwLjQ4MSwtNS42OTcgMzIuMTA5LC0xLjk0NiAzMi4zMDYsMS45NDYgMzAuNjQ3LDUuNjk3IDI4Ljc2OCw5LjI0IDI2LjY3LDEyLjU3MSAyNC4zNTMsMTUuNjkyIDIxLjgxNywxOC42MDQgMTkuMDYyLDIxLjMwNSAxNi4wODcsMjMuNzk2IDEyLjg5MywyNi4wNzggOS40ODIsMjguMTQ4IDUuODQ4LDMwLjAwOSAxLjk5OSwzMS42NiAtMS45OTgsMzEuNDc4IC01Ljg0OSwyOS44OTEgLTkuNDgxLDI4LjA4NCAtMTIuODk0LDI2LjA1OCAtMTYuMDg3LDIzLjgxMiAtMTkuMDYyLDIxLjM0OSAtMjEuODE3LDE4LjY2NSAtMjQuMzUyLDE1Ljc2MyAtMjYuNjcxLDEyLjY0MiAtMjguNzY4LDkuMyAtMzAuNjQ3LDUuNzQyIC0zMi4zMDYsMS45NjIgLTMyLjEwOSwtMS45NjIgLTMwLjQ4MSwtNS43NDIgLTI4LjYzMiwtOS4zIC0yNi41NjIsLTEyLjY0MiAtMjQuMjY5LC0xNS43NjMgLTIxLjc1MywtMTguNjY1IC0xOS4wMTYsLTIxLjM0OSAtMTYuMDU2LC0yMy44MTIgLTEyLjg3NiwtMjYuMDU4IC05LjQ3MSwtMjguMDg0IC01Ljg0NiwtMjkuODkxIC0xLjg5OCwtMjkuOTA0IC0wLjEsLTEuNTc0IDEuOTk4LC0zMS42NiA1Ljg0NiwtMzAuMDA5IHoiLz4KICAgICAgPHBhdGggaWQ9ImxwZV9wYXRoLWVmZmVjdDIwMiIgc3R5bGU9ImZpbGw6I2JhZGE1NTtzdHJva2Utd2lkdGg6OXB4IiBjbGFzcz0icG93ZXJjbGlwIiBkPSJtIDIzNzkuNDYzOSwwLjQ5MTc4NTk2IGggNjUyLjYyODkgViA2MjQuNTk0NDQgSCAyMzc5LjQ2MzkgWiBNIDI0OTMuNTkzLDIyMi43MjYgbCAtOS40NzEsMjguMTQ4IC01Ljg0NiwzMC4wMDkgLTEuOTk4LDMxLjY2IDAuMSwxLjU3NCAxLjg5OCwyOS45MDQgNS44NDYsMjkuODkxIDkuNDcxLDI4LjA4NCAxMi44NzYsMjYuMDU4IDE2LjA1NiwyMy44MTIgMTkuMDE2LDIxLjM0OSAyMS43NTMsMTguNjY1IDI0LjI2OSwxNS43NjMgMjYuNTYyLDEyLjY0MiAyOC42MzIsOS4zIDMwLjQ4MSw1Ljc0MiAzMi4xMDksMS45NjIgMzIuMzA2LC0xLjk2MiAzMC42NDcsLTUuNzQyIDI4Ljc2OCwtOS4zIDI2LjY3MSwtMTIuNjQyIDI0LjM1MiwtMTUuNzYzIDIxLjgxNywtMTguNjY1IDE5LjA2MiwtMjEuMzQ5IDE2LjA4NywtMjMuODEyIDEyLjg5NCwtMjYuMDU4IDkuNDgxLC0yOC4wODQgNS44NDksLTI5Ljg5MSAxLjk5OCwtMzEuNDc4IC0xLjk5OSwtMzEuNjYgLTUuODQ4LC0zMC4wMDkgLTkuNDgyLC0yOC4xNDggLTEyLjg5MywtMjYuMDc4IC0xNi4wODcsLTIzLjc5NiAtMTkuMDYyLC0yMS4zMDUgLTIxLjgxNywtMTguNjA0IC0yNC4zNTMsLTE1LjY5MiAtMjYuNjcsLTEyLjU3MSAtMjguNzY4LC05LjI0IC0zMC42NDcsLTUuNjk3IC0zMi4zMDYsLTEuOTQ2IC0zMi4xMDksMS45NDYgLTMwLjQ4MSw1LjY5NyAtMjguNjMyLDkuMjQgLTI2LjU2MiwxMi41NzEgLTI0LjI2OSwxNS42OTIgLTIxLjc1MywxOC42MDQgLTE5LjAxNiwyMS4zMDUgLTE2LjA1NiwyMy43OTYgeiIvPgogICAgPC9jbGlwUGF0aD4KICA8L2RlZnM+CiAgPHBvbHlnb24gc3Ryb2tlLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgcG9pbnRzPSIxOTg4LjE0MiA5Ny45NzcgMTk5OS4yNDEgOTQuODA5IDIwMTAuNzMxIDkyLjM5NSAyMDIyLjU4IDkwLjY3NSAyMDM0Ljc5IDg5LjY0NSAyMDQ3LjM2IDg5LjMwMiAyMDYzLjE4OCA4OS43MjYgMjA3OC4yNTUgOTAuOTYzIDIwOTIuNTUzIDkyLjk2MiAyMTA2LjA3NiA5NS42NzMgMjExOC44MTkgOTkuMDQ0IDIxMzAuNzc2IDEwMy4wMjUgMjE0MS45NCAxMDcuNTYzIDIxNTIuMzA2IDExMi42MDkgMjE2MS44NjcgMTE4LjExMSAyMTcwLjYxOCAxMjQuMDE5IDIxNzguNTUzIDEzMC4yOCAyMTg1LjY2NiAxMzYuODQ1IDIxOTIuNzUyIDE0NC42NzggMjE5OC45MjQgMTUzLjA0OCAyMjA0LjIzNyAxNjEuOTUzIDIyMDguNzQ4IDE3MS4zODkgMjIxMi41MTYgMTgxLjM1MyAyMjE1LjU5NiAxOTEuODQzIDIyMTguMDQ1IDIwMi44NTQgMjIxOS45MjIgMjE0LjM4NSAyMjIxLjI4MiAyMjYuNDMyIDIyMjIuMTgzIDIzOC45OTMgMjIyMi42ODEgMjUyLjA2NCAyMjIyLjgzNSAyNjUuNjQyIDIyMjIuODM1IDYwOC44MTIgMjMwNy41NDcgNjA4LjgxMiAyMzA3LjU0NyAyNTAuOTQ3IDIzMDUuNzQ1IDIxNS45MTEgMjMwMC4zMzIgMTgzLjA4NyAyMjkxLjI5OSAxNTIuNjM0IDIyNzguNjM3IDEyNC43MTEgMjI2Mi4zMzggOTkuNDc4IDIyNDIuMzkyIDc3LjA5MiAyMjE4Ljc5MSA1Ny43MTUgMjE5MS41MjQgNDEuNTA0IDIxNjAuNTg0IDI4LjYxOCAyMTI1Ljk2MSAxOS4yMTcgMjA4Ny42NDYgMTMuNDYgMjA0NS42MzEgMTEuNTA1IDIwMTQuNjUzIDEyLjk3NiAxOTg0LjIyNiAxNy40MzYgMTk1NC43NiAyNC45NTggMTkyNi42NjMgMzUuNjEzIDE5MDAuMzQzIDQ5LjQ3MyAxODc2LjIwNyA2Ni42MTIgMTg1My43MTggODQuODM4IDE4MzguNDg4IDk5LjQ3OCAxODE4LjU0MiA3Ny4wOTIgMTc5NC45NCA1Ny43MTUgMTc2Ny42NzQgNDEuNTA0IDE3MzYuNzM0IDI4LjYxOCAxNzAyLjExMSAxOS4yMTcgMTY2My43OTYgMTMuNDYgMTYyMS43ODEgMTEuNTA1IDE1OTAuODAyIDEyLjk3NiAxNTYwLjM3NiAxNy40MzYgMTUzMC45MSAyNC45NTggMTUwMi44MTMgMzUuNjEzIDE0NzYuNDkyIDQ5LjQ3MyAxNDUyLjM1NyA2Ni42MTEgMTQzMC44MTUgODcuMDk5IDE0MTIuMjc0IDExMS4wMDggMTM5Ny4xNDMgMTM4LjQxMSAxMzg1LjgyOSAxNjkuMzggMTM3OC43NDIgMjAzLjk4NiAxMzc2LjI4OSAyNDIuMzAyIDEzNzYuMjg5IDYwOC44MTIgMTQ2MS4wMDEgNjA4LjgxMiAxNDYxLjAwMSAyNjAuNDU1IDE0NjEuMTg3IDI0NC42MDQgMTQ2MS43NjUgMjMwLjI0MSAxNDYyLjc3IDIxNy4yMzUgMTQ2NC4yMzQgMjA1LjQ1MyAxNDY2LjE5MSAxOTQuNzY0IDE0NjguNjcyIDE4NS4wMzUgMTQ3MS43MTIgMTc2LjEzNSAxNDc1LjM0NCAxNjcuOTMxIDE0NzkuNTk5IDE2MC4yOTIgMTQ4NC41MTIgMTUzLjA4NCAxNDkwLjExNSAxNDYuMTc3IDE0OTYuNDQyIDEzOS40MzggMTUwNS4wNSAxMzEuMzcgMTUxNC4wMTggMTI0LjAxOSAxNTIzLjM0NiAxMTcuMzgyIDE1MzMuMDM1IDExMS40NTcgMTU0My4wODQgMTA2LjI0IDE1NTMuNDkzIDEwMS43MjggMTU2NC4yNjIgOTcuOTE5IDE1NzUuMzkxIDk0LjgwOSAxNTg2Ljg4IDkyLjM5NSAxNTk4LjczIDkwLjY3NSAxNjEwLjk0IDg5LjY0NSAxNjIzLjUxIDg5LjMwMiAxNjM5LjMzOCA4OS43MjYgMTY1NC40MDQgOTAuOTYzIDE2NjguNzAyIDkyLjk2MiAxNjgyLjIyNSA5NS42NzMgMTY5NC45NjkgOTkuMDQ0IDE3MDYuOTI1IDEwMy4wMjUgMTcxOC4wODkgMTA3LjU2MyAxNzI4LjQ1NSAxMTIuNjA5IDE3MzguMDE3IDExOC4xMTEgMTc0Ni43NjggMTI0LjAxOSAxNzU0LjcwMyAxMzAuMjggMTc2MS44MTUgMTM2Ljg0NSAxNzY4LjkwMiAxNDQuNjc4IDE3NzUuMDczIDE1My4wNDggMTc4MC4zODYgMTYxLjk1MyAxNzg0Ljg5OCAxNzEuMzg5IDE3ODguNjY1IDE4MS4zNTMgMTc5MS43NDUgMTkxLjg0MyAxNzk0LjE5NSAyMDIuODU0IDE3OTYuMDcxIDIxNC4zODUgMTc5Ny40MzEgMjI2LjQzMyAxNzk4LjMzMiAyMzguOTkzIDE3OTguODMxIDI1Mi4wNjQgMTc5OC45ODUgMjY1LjY0MiAxODAwLjAzMSA2MDcuNDkyIDE4ODQuMTY5IDYwOC42MTggMTg4NC44NTEgMjYwLjQ1NSAxODg1LjAzNyAyNDQuNjA0IDE4ODUuNjE2IDIzMC4yNDEgMTg4Ni42MjEgMjE3LjIzNSAxODg4LjA4NSAyMDUuNDUzIDE4OTAuMDQxIDE5NC43NjQgMTg5Mi41MjMgMTg1LjAzNSAxODk1LjU2MyAxNzYuMTM1IDE4OTkuMTk0IDE2Ny45MzEgMTkwMy40NSAxNjAuMjkyIDE5MDguMzYyIDE1My4wODQgMTkxMy45NjYgMTQ2LjE3NyAxOTIwLjI5MiAxMzkuNDM4IDE5MjguOSAxMzEuMzcgMTkzNy44NjggMTI0LjAxOSAxOTQ3LjE5NyAxMTcuMzgyIDE5NTYuODg1IDExMS40NTcgMTk2Ni45MzQgMTA2LjI0IDE5NzcuMzczIDEwMS43ODciIHN0eWxlPSJzdHJva2Utd2lkdGg6IDlweDsiIGlkPSJwb2x5Z29uMTgiLz4KICA8cG9seWdvbiBzdHJva2Utb3BhY2l0eT0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBwb2ludHM9IjUxNy40MDggMTcuNzggNTEwLjM0OCAxNy43OCA1MDMuMjg5IDE3Ljc4IDQ5Ni4yMyAxNy43OCA0ODkuMTcgMTcuNzggNDgyLjExMSAxNy43OCA0NzUuMDUyIDE3Ljc4IDQ2Ny45OTIgMTcuNzggNDYwLjkzMyAxNy43OCA0NTMuODc0IDE3Ljc4IDQ0Ni44MTQgMTcuNzggNDM5Ljc1NSAxNy43OCA0MzIuNjk2IDE3Ljc4IDQzMi42OTYgNDYuMzc3IDQzMi42OTYgNzQuOTc1IDQzMi42OTYgMTAzLjU3MiA0MzIuNjk2IDEzMi4xNyA0MzIuNjk2IDE2MC43NjcgNDMyLjY5NiAxODkuMzY1IDQzMi42OTYgMjE3Ljk2MiA0MzIuNjk2IDI0Ni41NiA0MzIuNjk2IDI3NS4xNTcgNDMyLjY5NiAzMDMuNzU1IDQzMi42OTYgMzMyLjM1MiA0MzIuNjk2IDM2MC45NSA0MzIuNTQyIDM3NC41MjggNDMyLjA0MyAzODcuNTk4IDQzMS4xNDMgNDAwLjE1OSA0MjkuNzgyIDQxMi4yMDYgNDI3LjkwNiA0MjMuNzM3IDQyNS40NTYgNDM0Ljc0OSA0MjIuMzc2IDQ0NS4yMzggNDE4LjYwOSA0NTUuMjAyIDQxNC4wOTggNDY0LjYzOCA0MDguNzg1IDQ3My41NDMgNDAyLjYxMyA0ODEuOTE0IDM5NS41MjYgNDg5Ljc0NyAzODguNDE0IDQ5Ni4zMTIgMzgwLjQ3OSA1MDIuNTczIDM3MS43MjggNTA4LjQ4IDM2Mi4xNjYgNTEzLjk4MiAzNTEuODAxIDUxOS4wMjggMzQwLjYzNiA1MjMuNTY3IDMyOC42OCA1MjcuNTQ3IDMxNS45MzYgNTMwLjkxOCAzMDIuNDEzIDUzMy42MjkgMjg4LjExNSA1MzUuNjI5IDI3My4wNDkgNTM2Ljg2NSAyNTcuMjIxIDUzNy4yODkgMjQ0LjY1MSA1MzYuOTQ3IDIzMi40NDEgNTM1LjkxNyAyMjAuNTkxIDUzNC4xOTYgMjA5LjEwMiA1MzEuNzgzIDE5Ny45NzMgNTI4LjY3MyAxODcuMjA0IDUyNC44NjMgMTc2Ljc5NSA1MjAuMzUyIDE2Ni43NDYgNTE1LjEzNSAxNTcuMDU3IDUwOS4yMDkgMTQ3LjcyOSA1MDIuNTczIDEzOC43NjEgNDk1LjIyMiAxMzAuMTUzIDQ4Ny4xNTQgMTIzLjgyNiA0ODAuNDE0IDExOC4yMjMgNDczLjUwNyAxMTMuMzEgNDY2LjMgMTA5LjA1NSA0NTguNjYgMTA1LjQyMyA0NTAuNDU2IDEwMi4zODQgNDQxLjU1NiA5OS45MDIgNDMxLjgyNyA5Ny45NDYgNDIxLjEzOCA5Ni40ODEgNDA5LjM1NyA5NS40NzYgMzk2LjM1MSA5NC44OTggMzgxLjk4OCA5NC43MTIgMzY2LjEzNiA5NC43MTIgMzM3LjEwNyA5NC43MTIgMzA4LjA3NyA5NC43MTIgMjc5LjA0NyA5NC43MTIgMjUwLjAxNyA5NC43MTIgMjIwLjk4OCA5NC43MTIgMTkxLjk1OCA5NC43MTIgMTYyLjkyOCA5NC43MTIgMTMzLjg5OCA5NC43MTIgMTA0Ljg2OSA5NC43MTIgNzUuODM5IDk0LjcxMiA0Ni44MDkgOTQuNzEyIDE3Ljc4IDg3LjY1MyAxNy43OCA4MC41OTMgMTcuNzggNzMuNTM0IDE3Ljc4IDY2LjQ3NSAxNy43OCA1OS40MTUgMTcuNzggNTIuMzU2IDE3Ljc4IDQ1LjI5NyAxNy43OCAzOC4yMzcgMTcuNzggMzEuMTc4IDE3Ljc4IDI0LjExOSAxNy43OCAxNy4wNTkgMTcuNzggMTAgMTcuNzggMTAgNDguMzIyIDEwIDc4Ljg2NSAxMCAxMDkuNDA3IDEwIDEzOS45NDkgMTAgMTcwLjQ5MiAxMCAyMDEuMDM0IDEwIDIzMS41NzcgMTAgMjYyLjExOSAxMCAyOTIuNjYyIDEwIDMyMy4yMDQgMTAgMzUzLjc0NyAxMCAzODQuMjg5IDEyLjQ1MyA0MjIuNjA1IDE5LjU0IDQ1Ny4yMTEgMzAuODU0IDQ4OC4xOCA0NS45ODUgNTE1LjU4MyA2NC41MjYgNTM5LjQ5MiA4Ni4wNjggNTU5Ljk4IDExMC4yMDMgNTc3LjExOCAxMzYuNTI0IDU5MC45NzkgMTY0LjYyMSA2MDEuNjM0IDE5NC4wODcgNjA5LjE1NSAyMjQuNTEzIDYxMy42MTUgMjU1LjQ5MiA2MTUuMDg2IDI5Ny41MDcgNjEzLjEzMiAzMzUuODIyIDYwNy4zNzUgMzcwLjQ0NSA1OTcuOTc0IDQwMS4zODUgNTg1LjA4OCA0MjguNjUxIDU2OC44NzcgNDUyLjI1MyA1NDkuNDk5IDQ3Mi4xOTkgNTI3LjExNCA0ODguNDk4IDUwMS44OCA1MDEuMTYgNDczLjk1OCA1MTAuMTkyIDQ0My41MDUgNTE1LjYwNSA0MTAuNjgxIDUxNy40MDggMzc1LjY0NSA1MTcuNDA4IDM0NS44MjMgNTE3LjQwOCAzMTYuMDAxIDUxNy40MDggMjg2LjE3OCA1MTcuNDA4IDI1Ni4zNTYgNTE3LjQwOCAyMjYuNTM0IDUxNy40MDggMTk2LjcxMiA1MTcuNDA4IDE2Ni44OSA1MTcuNDA4IDEzNy4wNjggNTE3LjQwOCAxMDcuMjQ2IDUxNy40MDggNzcuNDI0IDUxNy40MDggNDcuNjAyIDUxNy40MDggMTkuMjcxIiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiA5cHg7IiBpZD0icG9seWdvbjIwIi8+CiAgPHBvbHlnb24gc3Ryb2tlLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgcG9pbnRzPSIyMzg4Ljk3MyAzMTIuNTQzIDIzOTEuNDgzIDM1Mi4wODkgMjM5OC44OTQgMzkwLjQ4IDI0MTEuMDI5IDQyNy4yOCAyNDI3LjcxMSA0NjIuMDU0IDI0NDguNzY0IDQ5NC4zNjYgMjQ3NC4wMDkgNTIzLjc4MyAyNTAzLjI3MSA1NDkuODY4IDI1MzYuMzcxIDU3Mi4xODYgMjU3My4xMzMgNTkwLjMwMiAyNjEzLjM3OSA2MDMuNzgxIDI2NTYuOTMzIDYxMi4xODcgMjcwMy42MTggNjE1LjA4NiAyNzUxLjg0IDYxMi4xNzEgMjc5Ni41NzggNjAzLjcyMSAyODM3LjY5NiA1OTAuMTggMjg3NS4wNTkgNTcxLjk5NCAyOTA4LjUzMiA1NDkuNjA1IDI5MzcuOTggNTIzLjQ1OSAyOTYzLjI2OSA0OTMuOTk5IDI5ODQuMjYzIDQ2MS42NjkgMzAwMC44MjYgNDI2LjkxNSAzMDEyLjgyNCAzOTAuMTggMzAyMC4xMjIgMzUxLjkwOCAzMDIyLjU4NCAzMTIuNTQzIDMwMjAuMDU3IDI3Mi4wODkgMzAxMi41OTIgMjMzLjEwNiAzMDAwLjM2NyAxOTUuOTgzIDI5ODMuNTU4IDE2MS4xMTEgMjk2Mi4zNDQgMTI4Ljg4MSAyOTM2LjkgOTkuNjgyIDI5MDcuNDA0IDczLjkwNSAyODc0LjAzNCA1MS45NCAyODM2Ljk2NiAzNC4xNzcgMjc5Ni4zNzcgMjEuMDA1IDI3NTIuNDQ1IDEyLjgxNiAyNzA1LjM0NyAxMCAyNjU4Ljk5MSAxMi44MzMgMjYxNS41OCAyMS4wNjUgMjU3NS4zMjEgMzQuMjk4IDI1MzguNDE5IDUyLjEzMiAyNTA1LjA4NCA3NC4xNjggMjQ3NS41MjIgMTAwLjAwNyAyNDQ5LjkzOSAxMjkuMjQ5IDI0MjguNTQ0IDE2MS40OTYgMjQxMS41NDIgMTk2LjM0OCAyMzk5LjE0MiAyMzMuNDA2IDIzOTEuNTUgMjcyLjI3MSAyMzg5LjEwMiAzMTAuNTI5IiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiA5cHg7IiBpZD0icG9seWdvbjIyIiBjbGlwLXBhdGg9InVybCgjY2xpcFBhdGgxOTgpIiBkPSJtIDIzODguOTczLDMxMi41NDMgMi41MSwzOS41NDYgNy40MTEsMzguMzkxIDEyLjEzNSwzNi44IDE2LjY4MiwzNC43NzQgMjEuMDUzLDMyLjMxMiAyNS4yNDUsMjkuNDE3IDI5LjI2MiwyNi4wODUgMzMuMSwyMi4zMTggMzYuNzYyLDE4LjExNiA0MC4yNDYsMTMuNDc5IDQzLjU1NCw4LjQwNiA0Ni42ODUsMi44OTkgNDguMjIyLC0yLjkxNSA0NC43MzgsLTguNDUgNDEuMTE4LC0xMy41NDEgMzcuMzYzLC0xOC4xODYgMzMuNDczLC0yMi4zODkgMjkuNDQ4LC0yNi4xNDYgMjUuMjg5LC0yOS40NiAyMC45OTQsLTMyLjMzIDE2LjU2MywtMzQuNzU0IDExLjk5OCwtMzYuNzM1IDcuMjk4LC0zOC4yNzIgMi40NjIsLTM5LjM2NSAtMi41MjcsLTQwLjQ1NCAtNy40NjUsLTM4Ljk4MyAtMTIuMjI1LC0zNy4xMjMgLTE2LjgwOSwtMzQuODcyIC0yMS4yMTQsLTMyLjIzIC0yNS40NDQsLTI5LjE5OSAtMjkuNDk2LC0yNS43NzcgLTMzLjM3LC0yMS45NjUgLTM3LjA2OCwtMTcuNzYzIC00MC41ODksLTEzLjE3MiAtNDMuOTMyLC04LjE4OSAtNDcuMDk4LC0yLjgxNiAtNDYuMzU2LDIuODMzIC00My40MTEsOC4yMzIgLTQwLjI1OSwxMy4yMzMgLTM2LjkwMiwxNy44MzQgLTMzLjMzNSwyMi4wMzYgLTI5LjU2MiwyNS44MzkgLTI1LjU4MywyOS4yNDIgLTIxLjM5NSwzMi4yNDcgLTE3LjAwMiwzNC44NTIgLTEyLjQsMzcuMDU4IC03LjU5MiwzOC44NjUgLTIuNDQ4LDM4LjI1OCB6Ii8+CiAgPHBvbHlnb24gc3Ryb2tlLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgcG9pbnRzPSIxMTA1LjQxOSA2MDguODUzIDEwOTguMzU5IDYwOC44NTMgMTA5MS4zIDYwOC44NTMgMTA4NC4yNDEgNjA4Ljg1MyAxMDc3LjE4MSA2MDguODUzIDEwNzAuMTIyIDYwOC44NTMgMTA2My4wNjMgNjA4Ljg1MyAxMDU2LjAwMyA2MDguODUzIDEwNDguOTQ0IDYwOC44NTMgMTA0MS44ODUgNjA4Ljg1MyAxMDM0LjgyNSA2MDguODUzIDEwMjcuNzY2IDYwOC44NTMgMTAyMC43MDcgNjA4Ljg1MyAxMDIwLjcwNyA1ODAuMjU2IDEwMjAuNzA3IDU1MS42NTggMTAyMC43MDcgNTIzLjA2MSAxMDIwLjcwNyA0OTQuNDYzIDEwMjAuNzA3IDQ2NS44NjYgMTAyMC43MDcgNDM3LjI2OCAxMDIwLjcwNyA0MDguNjcxIDEwMjAuNzA3IDM4MC4wNzMgMTAyMC43MDcgMzUxLjQ3NiAxMDIwLjcwNyAzMjIuODc4IDEwMjAuNzA3IDI5NC4yODEgMTAyMC43MDcgMjY1LjY4MyAxMDIwLjU1MyAyNTIuMTA1IDEwMjAuMDU0IDIzOS4wMzUgMTAxOS4xNTMgMjI2LjQ3NCAxMDE3Ljc5MyAyMTQuNDI3IDEwMTUuOTE3IDIwMi44OTYgMTAxMy40NjcgMTkxLjg4NCAxMDEwLjM4NyAxODEuMzk1IDEwMDYuNjIgMTcxLjQzMSAxMDAyLjEwOCAxNjEuOTk1IDk5Ni43OTUgMTUzLjA5IDk5MC42MjQgMTQ0LjcxOSA5ODMuNTM3IDEzNi44ODYgOTc2LjQyNSAxMzAuMzIyIDk2OC40OSAxMjQuMDYgOTU5LjczOSAxMTguMTUzIDk1MC4xNzcgMTEyLjY1MSA5MzkuODExIDEwNy42MDUgOTI4LjY0NyAxMDMuMDY2IDkxNi42OSA5OS4wODYgOTAzLjk0OCA5NS43MTUgODkwLjQyNCA5My4wMDQgODc2LjEyNiA5MS4wMDUgODYxLjA2IDg5Ljc2OCA4NDUuMjMyIDg5LjM0NCA4MzIuNjYyIDg5LjY4NyA4MjAuNDUyIDkwLjcxNyA4MDguNjAyIDkyLjQzNyA3OTcuMTEzIDk0Ljg1IDc4NS45ODQgOTcuOTYgNzc1LjIxNSAxMDEuNzcgNzY0LjgwNiAxMDYuMjgxIDc1NC43NTcgMTExLjQ5OCA3NDUuMDY4IDExNy40MjQgNzM1Ljc0IDEyNC4wNiA3MjYuNzcyIDEzMS40MTEgNzE4LjE2NCAxMzkuNDc5IDcxMS44MzcgMTQ2LjIxOSA3MDYuMjM0IDE1My4xMjYgNzAxLjMyMSAxNjAuMzMzIDY5Ny4wNjYgMTY3Ljk3MyA2OTMuNDM1IDE3Ni4xNzcgNjkwLjM5NSAxODUuMDc3IDY4Ny45MTMgMTk0LjgwNiA2ODUuOTU2IDIwNS40OTUgNjg0LjQ5MiAyMTcuMjc2IDY4My40ODcgMjMwLjI4MiA2ODIuOTA5IDI0NC42NDUgNjgyLjcyMyAyNjAuNDk3IDY4Mi43MjMgMjg5LjUyNiA2ODIuNzIzIDMxOC41NTYgNjgyLjcyMyAzNDcuNTg2IDY4Mi43MjMgMzc2LjYxNiA2ODIuNzIzIDQwNS42NDUgNjgyLjcyMyA0MzQuNjc1IDY4Mi43MjMgNDYzLjcwNSA2ODIuNzIzIDQ5Mi43MzUgNjgyLjcyMyA1MjEuNzY0IDY4Mi43MjMgNTUwLjc5NCA2ODIuNzIzIDU3OS44MjQgNjgyLjcyMyA2MDguODUzIDY3NS42NjQgNjA4Ljg1MyA2NjguNjA0IDYwOC44NTMgNjYxLjU0NSA2MDguODUzIDY1NC40ODYgNjA4Ljg1MyA2NDcuNDI2IDYwOC44NTMgNjQwLjM2NyA2MDguODUzIDYzMy4zMDggNjA4Ljg1MyA2MjYuMjQ4IDYwOC44NTMgNjE5LjE4OSA2MDguODUzIDYxMi4xMyA2MDguODUzIDYwNS4wNyA2MDguODUzIDU5OC4wMTEgNjA4Ljg1MyA1OTguMDExIDU3OC4zMTEgNTk4LjAxMSA1NDcuNzY5IDU5OC4wMTEgNTE3LjIyNiA1OTguMDExIDQ4Ni42ODQgNTk4LjAxMSA0NTYuMTQxIDU5OC4wMTEgNDI1LjU5OSA1OTguMDExIDM5NS4wNTYgNTk4LjAxMSAzNjQuNTE0IDU5OC4wMTEgMzMzLjk3MSA1OTguMDExIDMwMy40MjkgNTk4LjAxMSAyNzIuODg3IDU5OC4wMTEgMjQyLjM0NCA2MDAuNDY0IDIwNC4wMjggNjA3LjU1MSAxNjkuNDIyIDYxOC44NjUgMTM4LjQ1MyA2MzMuOTk2IDExMS4wNSA2NTIuNTM3IDg3LjE0MSA2NzQuMDc5IDY2LjY1MyA2OTguMjE0IDQ5LjUxNSA3MjQuNTM1IDM1LjY1NSA3NTIuNjMyIDI0Ljk5OSA3ODIuMDk4IDE3LjQ3OCA4MTIuNTI0IDEzLjAxOCA4NDMuNTAzIDExLjU0NyA4ODUuNTE4IDEzLjUwMSA5MjMuODMzIDE5LjI1OSA5NTguNDU2IDI4LjY2IDk4OS4zOTYgNDEuNTQ1IDEwMTYuNjYyIDU3Ljc1NiAxMDQwLjI2NCA3Ny4xMzQgMTA2MC4yMSA5OS41MTkgMTA3Ni41MDkgMTI0Ljc1MyAxMDg5LjE3MSAxNTIuNjc1IDEwOTguMjAzIDE4My4xMjggMTEwMy42MTYgMjE1Ljk1MiAxMTA1LjQxOSAyNTAuOTg4IDExMDUuNDE5IDI4MC44MSAxMTA1LjQxOSAzMTAuNjMyIDExMDUuNDE5IDM0MC40NTUgMTEwNS40MTkgMzcwLjI3NyAxMTA1LjQxOSA0MDAuMDk5IDExMDUuNDE5IDQyOS45MjEgMTEwNS40MTkgNDU5Ljc0MyAxMTA1LjQxOSA0ODkuNTY1IDExMDUuNDE5IDUxOS4zODcgMTEwNS40MTkgNTQ5LjIwOSAxMTA1LjQxOSA1NzkuMDMxIDExMDUuNDE5IDYwNy4zNjIiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDlweDsiIGlkPSJwb2x5Z29uMjYiLz4KICA8cG9seWdvbiBzdHJva2Utb3BhY2l0eT0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBwb2ludHM9IjEyOTAuNjM0IDE3LjkzMyAxMjgzLjU3NSAxNy45MzMgMTI3Ni41MTYgMTcuOTMzIDEyNjkuNDU2IDE3LjkzMyAxMjYyLjM5NyAxNy45MzMgMTI1NS4zMzggMTcuOTMzIDEyNDguMjc4IDE3LjkzMyAxMjQxLjIxOSAxNy45MzMgMTIzNC4xNiAxNy45MzMgMTIyNy4xIDE3LjkzMyAxMjIwLjA0MSAxNy45MzMgMTIxMi45ODIgMTcuOTMzIDEyMDUuOTIyIDE3LjkzMyAxMjA1LjkyMiA2Ny4wNiAxMjA1LjkyMiAxMTYuMTg3IDEyMDUuOTIyIDE2NS4zMTQgMTIwNS45MjIgMjE0LjQ0MiAxMjA1LjkyMiAyNjMuNTY5IDEyMDUuOTIyIDMxMi42OTYgMTIwNS45MjIgMzYxLjgyMyAxMjA1LjkyMiA0MTAuOTUgMTIwNS45MjIgNDYwLjA3OCAxMjA1LjkyMiA1MDkuMjA1IDEyMDUuOTIyIDU1OC4zMzIgMTIwNS45MjIgNjA3LjQ1OSAxMjEyLjk4MiA2MDcuNDU5IDEyMjAuMDQxIDYwNy40NTkgMTIyNy4xIDYwNy40NTkgMTIzNC4xNiA2MDcuNDU5IDEyNDEuMjE5IDYwNy40NTkgMTI0OC4yNzggNjA3LjQ1OSAxMjU1LjMzOCA2MDcuNDU5IDEyNjIuMzk3IDYwNy40NTkgMTI2OS40NTYgNjA3LjQ1OSAxMjc2LjUxNiA2MDcuNDU5IDEyODMuNTc1IDYwNy40NTkgMTI5MC42MzQgNjA3LjQ1OSAxMjkwLjYzNCA1NTguMzMyIDEyOTAuNjM0IDUwOS4yMDUgMTI5MC42MzQgNDYwLjA3OCAxMjkwLjYzNCA0MTAuOTUgMTI5MC42MzQgMzYxLjgyMyAxMjkwLjYzNCAzMTIuNjk2IDEyOTAuNjM0IDI2My41NjkgMTI5MC42MzQgMjE0LjQ0MiAxMjkwLjYzNCAxNjUuMzE0IDEyOTAuNjM0IDExNi4xODcgMTI5MC42MzQgNjcuMDYgMTI5MC42MzQgMjAuMzg5IiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiA5cHg7IiBpZD0icG9seWdvbjI4Ii8+Cjwvc3ZnPg=='
                            }
                            alt='Unimo Logo'
                            width={80}
                            height={37}
                            priority
                        />
                    </div>
                    <div className={styles.center}>
                        <h1 className={styles.headline + ' ' + inter.className}>
                            All your devices.
                            <br />
                            One magic experience.
                        </h1>
                    </div>
                    {/* <div className={styles.subline + ' ' + inter.className}>
                    <p>Follow us on Twitter, Github or subscribe to be the first.</p>
                </div> */}

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <h2 className={inter.className}>Connected</h2>
                            <p className={inter.className}>Share your experience with your friends and family. No more silos.</p>
                        </div>

                        <div className={styles.card}>
                            <h2 className={inter.className}>Synced</h2>
                            <p className={inter.className}>Stay in sync with your devices with your data up-to-date.</p>
                        </div>

                        <div className={styles.card}>
                            <h2 className={inter.className}>Private</h2>
                            <p className={inter.className}>Privacy and freedom come first without dopamine traps. Keep your data yours.</p>
                        </div>

                        <div className={styles.card}>
                            <h2 className={inter.className}>Everywhere</h2>
                            <p className={inter.className}>Everywhere you go, always with you. Make the magic work for you.</p>
                        </div>
                    </div>
                </section>
                {/* <section className={styles.subscribeSection}>
                    <div>
                        <h2 className={inter.className}>
                            Despite the ways internet use and devices has evolved, the operating systems has remained very boring.
                            <br />
                            <br />
                            We’re building an entirely new way to live, work and connect. Enabling new seamless experience across your
                            digital life.
                        </h2>
                    </div>
                </section> */}
            </main>

            {/* <footer>Made by Radicals © 2023</footer> */}
        </>
    );
}
