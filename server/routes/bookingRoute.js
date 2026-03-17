import { Router } from "express";
import bookslot  from "../Controller/bookingController.js";

const router=Router();

router.post('/book',bookslot);

export default router;