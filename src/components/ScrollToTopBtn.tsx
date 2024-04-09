import { BiSolidUpArrow } from "solid-icons/bi";
import { Component, createEffect, createSignal } from "solid-js";

const ScrollToTopBtn: Component = () => {
	const [isVisible, setIsVisible] = createSignal(false);
	const listenToScroll = () => {
		const heightToHide = 15;
		const windowScrollHeight = document.body.scrollTop || document.documentElement.scrollTop;
		setIsVisible(windowScrollHeight > heightToHide);
	};
	createEffect(() => {
		window.addEventListener("scroll", listenToScroll);
		return () => window.removeEventListener("scroll", listenToScroll);
	});
	return (
		<div class="fixed top-0 end-0 me-1 mt-1">
			{isVisible() ? (
				<div class="tooltip tooltip-left" data-tip="Scroll to Top">
					<button
						class="btn btn-circle btn-secondary btn-sm"
						onClick={() => {
							window.scrollTo(0, 0);
						}}
					>
						<BiSolidUpArrow />
					</button>
				</div>
			) : (
				""
			)}
		</div>
	);
};

export default ScrollToTopBtn;
