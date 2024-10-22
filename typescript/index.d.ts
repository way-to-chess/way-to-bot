declare module "*.jpg";

declare module "*.jpeg";

declare module "*.webp";

declare module "*.png";

declare module "*.svg";

declare module "*.graphql";

declare module "*.mp3" {
    const path: string;

    export default path;
}

declare module "*.mp4";

// ! declare only before .css
declare module "*.module.css" {
    const classes: Record<string, string>;

    export default classes;
}

declare module "*.css";
