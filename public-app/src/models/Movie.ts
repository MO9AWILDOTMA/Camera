export interface HeroMovie {
    id: number,
    title: string,
    slug: string,
    description: string,
    image: string,
    status: string,
    cta: CtaType;
}

export type CtaType = "Learn More" | "Book Tickets" | "Pre-book" | "Reserve Spot"

export interface Movie {
    id: number,
    name: string,
    slug: string,
    description: string,
    status: MovieStatus,
    picturePaths: string[]
}

export enum MovieStatus {
    NOW_SHOWING = "Now Showing",
    COMING_SOON = "Coming Soon",
    PREMIERES_FRIDAY = "Premieres Friday",
    SPECIAL_SCREENING = "Special Screening",
    LIMITED_RELEASE = "Limited Release",
    EXCLUSIVE_PREMIERE = "Exclusive Premiere",
    BACK_BY_POPULAR_DEMAND = "Back By Popular Demand",
    ADVANCE_BOOKING = "Advance Booking",
    PREVIEW_SCREENING = "Preview Screening",
    FINAL_WEEK = "Final Week"
}