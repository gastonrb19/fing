import "reflect-metadata";

import {myDataSource} from "./app-data-source.js";
import { TypeSpendEntity } from "../models/TypeSpendEntity.js";

export const testConnection = async() => {
	try {
		await myDataSource.initialize();
		console.log("Data source has been initialized");

		// Seed base TypeSpends if they don't exist
		const typeSpendRepository = myDataSource.getRepository(TypeSpendEntity);
		const hasIngreso = await typeSpendRepository.findOneBy({ name: "Ingreso" });
		if (!hasIngreso) {
			const ts = new TypeSpendEntity();
			ts.name = "Ingreso";
			await typeSpendRepository.save(ts);
		}
		const hasGasto = await typeSpendRepository.findOneBy({ name: "Gasto" });
		if (!hasGasto) {
			const ts = new TypeSpendEntity();
			ts.name = "Gasto";
			await typeSpendRepository.save(ts);
		}
		console.log("Default TypeSpends verification complete.");
	}catch(error){
		console.error("Error during db init:", error)
	}	
}
