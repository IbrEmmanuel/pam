"use client";

import React from "react";

type Props = {
	className?: string;
	title: string;
	excerpt?: string;
	children?: React.ReactNode;
};

export default function ShareButton({ className, title, excerpt, children }: Props) {
	function handleClick() {
		if (typeof window === "undefined") return;
		if (navigator.share) {
			navigator.share({ title, text: excerpt, url: window.location.href }).catch(() => {});
		} else if (navigator.clipboard) {
			navigator.clipboard.writeText(window.location.href).then(() => {
				alert("Link copied to clipboard!");
			});
		}
	}

	return (
		<button type="button" onClick={handleClick} className={className}>
			{children}
		</button>
	);
}
