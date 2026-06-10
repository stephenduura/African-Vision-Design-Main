import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import donationsRouter from "./donations";
import teamRouter from "./team";
import partnersRouter from "./partners";
import eventsRouter from "./events";
import communityRouter from "./community";
import communityFeedRouter from "./communityFeed";
import blogRouter from "./blog";
import impactRouter from "./impact";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(donationsRouter);
router.use(teamRouter);
router.use(partnersRouter);
router.use(eventsRouter);
router.use(communityRouter);
router.use(communityFeedRouter);
router.use(blogRouter);
router.use(impactRouter);
router.use(contactRouter);

export default router;
