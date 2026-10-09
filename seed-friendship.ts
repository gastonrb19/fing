import { myDataSource } from './src/config/app-data-source.js';
import { SpendService } from './src/services/spend.js';
import { UserService } from './src/services/user.js';
import { SubcategoryService } from './src/services/subcategory.js';
import { CategoryService } from './src/services/category.js';
import { TypeSpendEntity } from './src/models/TypeSpendEntity.js';
import { User } from './src/models/UserEntity.js';
import { SpendEntity } from './src/models/SpendEntity.js';
import { SubcategoryEntity } from './src/models/SubcategoryEntity.js';

async function run() {
  await myDataSource.initialize();
  const userService = new UserService();
  const subcategoryService = new SubcategoryService(new CategoryService());
  const spendService = new SpendService(userService, subcategoryService);

  // Buscamos subcategoría de Restaurantes
  const subcategory = await myDataSource.getRepository(SubcategoryEntity).findOne({ where: { name: "Restaurantes" }});
  
  // Gasto 1: Gastón (ID 1) te cobra a ti (ID 2) la mitad de una pizza
  await spendService.create({
    name: "Pizza con Gastón",
    amount: 20000,
    userId: 1, // Creador: Gastón
    subcategoryId: subcategory.id,
    minDayToPayment: 15, // Día 15
    totalInstallment: 1, // 1 Cuota total
    fkTypeSpend: 2, // Variable
    startPayment: new Date().toISOString(),
    participants: [
        { userId: 1, percentage: 50 },
        { userId: 2, percentage: 50 } // Tú debes el 50%
    ]
  });
  console.log("✅ Gasto 'Pizza con Gastón' creado exitosamente.");

  // Buscamos subcategoría de Entretenimiento (si no hay usamos la misma)
  const subcategory2 = await myDataSource.getRepository(SubcategoryEntity).findOne({ where: { name: "Cine y Teatro" }}) || subcategory;

  // Gasto 2: TercerAmigo (ID 3) te cobra a ti (ID 2) una entrada al cine
  await spendService.create({
    name: "Entrada al Cine (TercerAmigo)",
    amount: 15000,
    userId: 3, // Creador: TercerAmigo
    subcategoryId: subcategory2.id,
    minDayToPayment: 10, // Día 10
    totalInstallment: 2, // 2 Cuotas
    fkTypeSpend: 2,
    startPayment: new Date().toISOString(),
    participants: [
        { userId: 2, percentage: 100 } // Tú debes el 100%
    ]
  });
  console.log("✅ Gasto 'Entrada al Cine' creado exitosamente.");

  await myDataSource.destroy();
}
run();
