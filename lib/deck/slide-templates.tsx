// lib/deck/slide-templates.ts
import type { ComponentType } from "react";
import type { SlideContent, SlideTemplateId } from "./slide-content-types";

import { Cover } from "@/components/deck/slides/Cover";
import { Problem } from "@/components/deck/slides/Problem";
import { Solution } from "@/components/deck/slides/Solution";
import { FiveCardGrid } from "@/components/deck/slides/FiveCardGrid";
import { DetailWithCode } from "@/components/deck/slides/DetailWithCode";
import { SixCardGrid } from "@/components/deck/slides/SixCardGrid";
import { NumberedPoints } from "@/components/deck/slides/NumberedPoints";
import { HeadlineWithScreenshot } from "@/components/deck/slides/HeadlineWithScreenshot";
import { HeadlineWithCode } from "@/components/deck/slides/HeadlineWithCode";
import { ComparisonTable } from "@/components/deck/slides/ComparisonTable";
import { ClosingCTA } from "@/components/deck/slides/ClosingCTA";
import { BigStat } from "@/components/deck/slides/BigStat";
import { Quote } from "@/components/deck/slides/Quote";

type AnySlideProps = { content: any; positionLabel?: string; logo?: React.ReactNode };

export const SLIDE_COMPONENTS: Record<SlideTemplateId, ComponentType<AnySlideProps>> = {
  Cover, Problem, Solution, FiveCardGrid,
  DetailWithCode, SixCardGrid, NumberedPoints,
  HeadlineWithScreenshot, HeadlineWithCode, ComparisonTable,
  ClosingCTA, BigStat, Quote,
};

/** Strongly-typed render helper. */
export function renderSlide(slide: SlideContent, props?: { positionLabel?: string; logo?: React.ReactNode }) {
  const Comp = SLIDE_COMPONENTS[slide.template] as ComponentType<{ content: typeof slide.content } & typeof props>;
  return <Comp content={slide.content as any} {...props} />;
}
