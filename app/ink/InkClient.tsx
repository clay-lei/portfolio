"use client";

import dynamic from "next/dynamic";

const InkBambooScene = dynamic(() => import("../UI/InkBambooScene"), {
    ssr: false
});

export default function InkClient() {
    return <InkBambooScene />;
}
