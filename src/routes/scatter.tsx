import { createFileRoute } from "@tanstack/react-router"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import Lenis from "lenis"
import { useEffect, useRef } from "react"

export const Route = createFileRoute("/scatter")({
	component: RouteComponent,
})

function RouteComponent() {
	const spotlightRef = useRef<HTMLDivElement | null>(null)
	const spotlightTitleRef = useRef(null)

	useEffect(() => {
		const lenis = new Lenis()
		lenis.on("scroll", ScrollTrigger.update)
		gsap.ticker.add((time) => {
			lenis.raf(time * 1000)
		})
		gsap.ticker.lagSmoothing(0)

		const images = document.querySelectorAll(".spotlight-img")
		const coverImg = document.querySelector(".spotlight-cover-img")

		const headerSplit = SplitText.create(spotlightTitleRef.current, {
			type: "words",
		})
		gsap.set(headerSplit.words, { opacity: 1 })

		const scatterDirections = [
			{ x: 1.3, y: 0.7 },
			{ x: -1.5, y: 1.0 },
			{ x: 1.1, y: -1.3 },
			{ x: -1.7, y: -0.8 },
			{ x: 0.8, y: 1.5 },
			{ x: -1.0, y: -1.4 },
			{ x: 1.6, y: 0.3 },
			{ x: -0.7, y: 1.7 },
			{ x: 1.2, y: -1.6 },
			{ x: -1.4, y: 0.9 },
			{ x: 1.8, y: -0.5 },
			{ x: -1.1, y: -1.8 },
			{ x: 0.9, y: 1.8 },
			{ x: -1.9, y: 0.4 },
			{ x: 1.0, y: -1.9 },
			{ x: -0.8, y: 1.9 },
			{ x: 1.7, y: -1.0 },
			{ x: -1.3, y: -1.2 },
			{ x: 0.7, y: 2.0 },
			{ x: 1.25, y: -0.2 },
		]

		const screenWidth = window.innerWidth
		const screenHeight = window.innerHeight
		const isMobile = screenWidth < 1000
		const scatterMultiplier = isMobile ? 2.5 : 0.5

		const startPositions = Array.from(images).map(() => ({
			x: 0,
			y: 0,
			z: -1000,
			scale: 0,
		}))

		const endPositions = scatterDirections.map((dir) => ({
			x: dir.x * screenWidth * scatterMultiplier,
			y: dir.y * screenHeight * scatterMultiplier,
			z: 2000,
			scale: 1,
		}))

		images.forEach((img, index) => {
			gsap.set(img, startPositions[index])
		})

		gsap.set(coverImg, {
			z: -1000,
			scale: 0,
			x: 0,
			y: 0,
		})

		const pinOnScroll = ScrollTrigger.create({
			trigger: spotlightRef.current,
			start: "top top",
			end: `+=${10 * window.innerHeight}`,
			pin: true,
			scrub: 1,
			onUpdate: (self) => {
				const progress = self.progress

				images.forEach((img, index) => {
					const staggerDelay = index * 0.03
					const scaleMultiplier = isMobile ? 4 : 2

					const imageProgress = Math.max(0, (progress - staggerDelay) * 4)

					const start = startPositions[index]
					const end = endPositions[index]

					const zValue = gsap.utils.interpolate(start.z, end.z, imageProgress)
					const scaleValue = gsap.utils.interpolate(
						start.scale,
						end.scale,
						imageProgress * scaleMultiplier,
					)
					const xValue = gsap.utils.interpolate(start.x, end.x, imageProgress)
					const yValue = gsap.utils.interpolate(start.y, end.y, imageProgress)

					gsap.set(img, {
						x: xValue,
						y: yValue,
						z: zValue,
						scale: scaleValue,
					})

					const coverProgress = Math.max(0, (progress - 0.7) * 4)
					const coverZValue = -1000 + 1000 * coverProgress
					const coverScaleValue = Math.min(1, coverProgress * 2)

					gsap.set(coverImg, {
						x: 0,
						y: 0,
						z: coverZValue,
						scale: coverScaleValue,
					})

					const containerScaleProgress = Math.max(0, (progress - 0.9) / 0.15)
					const containerScale = 1 - containerScaleProgress * 0.1

					const containerBorderRadiusProgress = Math.max(
						0,
						(progress - 0.8) / 0.4,
					)
					const containerBorderRadius = containerBorderRadiusProgress * 50

					gsap.set(spotlightRef.current, {
						scale: containerScale,
						transformOrigin: "top center",
						borderBottomLeftRadius: `${containerBorderRadius}px`,
						borderBottomRightRadius: `${containerBorderRadius}px`,
					})
				})

				headerSplit.words.forEach((word, index) => {
					const wordDelay = index * 0.05
					const wordProgress = Math.max(
						0,
						Math.min(1, (progress - (0.55 + wordDelay)) / 0.15),
					)
					const wordOpacity = 1 - wordProgress
					gsap.set(word, {
						opacity: wordOpacity,
					})
				})
			},
		})

		return () => {
			pinOnScroll.kill()
		}
	}, [])

	return (
		<>
			<section className="w-dvw h-svh p-8 overflow-hidden relative flex justify-center items-center">
				<h1 className="text-[5rem] tracking-tighter font-medium leading-3.5">
					MAIN PAGE
				</h1>
			</section>
			<section
				ref={spotlightRef}
				className="bg-black text-white w-dvw h-svh p-8 overflow-hidden relative flex justify-center items-center"
			>
				<div className="absolute top-0 left-0 w-full h-full transform-3d perspective-[2000px]">
					{Array.from({ length: 20 }).map((_, i) => (
						<div
							className="spotlight-img absolute top-1/2 left-1/2 -translate-1/2 w-[500px] h-[350px] will-change-transform"
							// biome-ignore lint/suspicious/noArrayIndexKey: okay.
							key={`spotlight-img-${i}`}
						>
							<img
								className="w-full h-full object-cover"
								src={`/image_${i + 1}.jpg`}
								alt={`spotlight-img-${i}`}
							/>
						</div>
					))}
				</div>
				<div className="spotlight-cover-img absolute top-0 left-0 w-full h-full transform-3d perspective-[2000px]">
					<video
						autoPlay
						muted
						playsInline
						loop
						controls={false}
						className="w-full h-full object-cover"
						src="/showreel.mp4"
					/>
				</div>
				<h1
					ref={spotlightTitleRef}
					className="spotlight-header z-1 text-[5rem] text-center tracking-tighter font-medium lg:leading-3.5 leading-18 wrap-break-word"
				>
					AV SPECIALIST AND VIDEOGRAPHER
				</h1>
			</section>
			<section className="w-screen h-screen flex px-10">
				<h1 className="text-[5rem] md:text-[10rem] tracking-tighter font-medium">
					ABOUT
				</h1>
			</section>
		</>
	)
}
