import { createFileRoute } from "@tanstack/react-router"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import Lenis from "lenis"
import { useEffect } from "react"

gsap.registerPlugin(ScrollTrigger, SplitText)

export const Route = createFileRoute("/")({
	component: Index,
})

function Index() {
	useEffect(() => {
		const lenis = new Lenis()
		lenis.on("scroll", ScrollTrigger.update)
		gsap.ticker.add((time) => {
			lenis.raf(time * 1000)
		})
		gsap.ticker.lagSmoothing(0)

		const parallaxTween = gsap.to("#second-section", {
			scrollTrigger: {
				trigger: "#video-hero",
				start: "top top",
				end: "bottom top",
				scrub: 1,
			},
			y: "-50vh",
			ease: "none",
		})

		const servicesText = document.querySelector("#services-text")
		if (servicesText) {
			const splitText = new SplitText(servicesText, { type: "chars" })

			gsap.fromTo(
				splitText.chars,
				{
					y: 20,
					opacity: 0,
				},
				{
					scrollTrigger: {
						trigger: "#second-section",
						start: "top bottom",
						end: "bottom center",
						scrub: false,
						once: true,
					},
					y: 0,
					opacity: 0.8,
					duration: 0.4,
					ease: "power1.out",
					stagger: 0.08,
				},
			)
		}

		return () => {
			parallaxTween.scrollTrigger?.kill()
		}
	}, [])

	return (
		<>
			<section id="video-hero" className="w-screen h-[110vh] z-0">
				<div className="w-3 h-3 rotate-45 absolute top-5 left-5 bg-white" />
				<div className="w-3 h-3 rotate-45 absolute top-5 right-5 bg-white" />
				<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
					<div className="flex w-full items-center justify-between px-4 md:px-12">
						<p className="uppercase text-[#FFFF00] text-sm font-medium">
							51.9244° N
						</p>
						<p className="uppercase mix-blend-difference text-white text-[2.5rem] lg:text-[3rem] text-center font-medium md:max-w-md lg:max-w-xl max-w-xs">
							AV-specialist & videographer Based in rotterdam
						</p>
						<p className="uppercase text-[#FFFF00] text-sm font-medium">
							4.4777° E
						</p>
					</div>
				</div>
				<video
					autoPlay
					muted
					playsInline
					loop
					controls={false}
					className="w-full h-full object-cover"
					src="/showreel.mp4"
				/>
			</section>
			<section
				id="second-section"
				className="absolute w-screen h-[150vh] bg-black rounded-t-[2.5rem] z-10"
			>
				<h1 id="services-text" className="text-white text-[5rem] p-12">
					SERVICES
				</h1>
			</section>
		</>
	)
}
