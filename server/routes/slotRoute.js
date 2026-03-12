import { Router } from "express";
import {getSlots} from "../Controller/getSlotsController.js";

const router=Router();

router.get('/slots',getSlots);

export default router;