import "reflect-metadata";
import { myDataSource } from "../src/config/app-data-source.js";
import { UserService } from "../src/services/user.js";
import { User } from "../src/models/UserEntity.js";
import { TypeSpendEntity } from "../src/models/TypeSpendEntity.js";
import { CategoryEntity } from "../src/models/CategoryEntity.js";
import { SubcategoryEntity } from "../src/models/SubcategoryEntity.js";
import { FriendshipEntity } from "../src/models/FriendshipEntity.js";

async function runSeed() {
  console.log("\n🌱 ==========================================");
  console.log("   INICIANDO SEEDER OFICIAL EN SUPABASE");
  console.log("==========================================\n");

  await myDataSource.initialize();
  const userService = new UserService();
  const typeSpendRepo = myDataSource.getRepository(TypeSpendEntity);
  const categoryRepo = myDataSource.getRepository(CategoryEntity);
  const subcategoryRepo = myDataSource.getRepository(SubcategoryEntity);
  const friendshipRepo = myDataSource.getRepository(FriendshipEntity);
  const userRepo = myDataSource.getRepository(User);

  // 1. TIPOS DE GASTO (TYPESPEND)
  console.log("🔹 1. Verificando Tipos de Gasto...");
  const typeSpendsToSeed = ["Ingreso", "Gasto", "Cuotas"];
  for (const typeName of typeSpendsToSeed) {
    let existing = await typeSpendRepo.findOneBy({ name: typeName });
    if (!existing) {
      const ts = new TypeSpendEntity();
      ts.name = typeName;
      await typeSpendRepo.save(ts);
      console.log(`   ✓ Creado Tipo: ${typeName}`);
    } else {
      console.log(`   ℹ Ya existe Tipo: ${typeName}`);
    }
  }

  // 2. CATEGORÍAS Y SUBCATEGORÍAS
  console.log("\n🔹 2. Verificando Categorías y Subcategorías...");
  const categoriesDefinition = [
    {
      name: "Servicios básicos",
      description: "Cuentas y servicios esenciales del hogar",
      subcategories: ["Agua", "Luz", "Gas"],
    },
    {
      name: "Alimentación",
      description: "Gastos en comida y provisiones diarias",
      subcategories: ["Supermercado", "Pan", "Minimarket"],
    },
  ];

  for (const catDef of categoriesDefinition) {
    let category = await categoryRepo.findOne({
      where: { name: catDef.name },
      relations: { subcategories: true },
    });

    if (!category) {
      category = new CategoryEntity();
      category.name = catDef.name;
      category.description = catDef.description;
      category = await categoryRepo.save(category);
      console.log(`   ✓ Creada Categoría: ${category.name}`);
    } else {
      console.log(`   ℹ Ya existe Categoría: ${category.name}`);
    }

    // Subcategorías
    for (const subName of catDef.subcategories) {
      let subcategory = await subcategoryRepo.findOneBy({
        name: subName,
        category: { id: category.id },
      });

      if (!subcategory) {
        subcategory = new SubcategoryEntity();
        subcategory.name = subName;
        subcategory.category = category;
        await subcategoryRepo.save(subcategory);
        console.log(`      ✓ Creada Subcategoría: ${subName} (en ${category.name})`);
      } else {
        console.log(`      ℹ Ya existe Subcategoría: ${subName}`);
      }
    }
  }

  // 3. USUARIOS OFICIALES
  console.log("\n🔹 3. Configurando Usuarios Oficiales con UserService...");
  const usersToSeed = [
    {
      username: "gastonrb",
      email: "gastonrb19@gmail.com",
      password: "luci1234",
      phone: "911111111",
    },
    {
      username: "jawi",
      email: "fonojaviera.reinoso@gmail.com",
      password: "cato1234",
      phone: "922222222",
    },
  ];

  const createdOrUpdatedUsers: User[] = [];

  for (const uData of usersToSeed) {
    let user = await userRepo.findOne({
      where: [{ username: uData.username }, { email: uData.email }],
    });

    if (!user) {
      user = await userService.create({
        username: uData.username,
        email: uData.email,
        hashedPassword: uData.password,
        phone: uData.phone,
      });
      console.log(`   ✓ Creado Usuario: @${user.username} (${user.email})`);
    } else {
      user = await userService.update(user.id, {
        hashedPassword: uData.password,
        email: uData.email,
        phone: uData.phone,
      });
      console.log(`   ✓ Actualizada Contraseña de: @${user.username} (${user.email})`);
    }
    createdOrUpdatedUsers.push(user);
  }

  // 4. AMISTAD MUTUA ENTRE gastonrb Y jawi
  console.log("\n🔹 4. Verificando Amistad Mutua...");
  const [userGaston, userJawi] = createdOrUpdatedUsers;
  if (userGaston && userJawi) {
    // Relación 1 -> 2
    let f1 = await friendshipRepo.findOneBy({
      userId: userGaston.id,
      friendId: userJawi.id,
    });
    if (!f1) {
      f1 = new FriendshipEntity();
      f1.userId = userGaston.id;
      f1.friendId = userJawi.id;
      await friendshipRepo.save(f1);
      console.log(`   ✓ Amistad creada: @${userGaston.username} ➔ @${userJawi.username}`);
    } else {
      console.log(`   ℹ Ya existe amistad: @${userGaston.username} ➔ @${userJawi.username}`);
    }

    // Relación 2 -> 1
    let f2 = await friendshipRepo.findOneBy({
      userId: userJawi.id,
      friendId: userGaston.id,
    });
    if (!f2) {
      f2 = new FriendshipEntity();
      f2.userId = userJawi.id;
      f2.friendId = userGaston.id;
      await friendshipRepo.save(f2);
      console.log(`   ✓ Amistad creada: @${userJawi.username} ➔ @${userGaston.username}`);
    } else {
      console.log(`   ℹ Ya existe amistad: @${userJawi.username} ➔ @${userGaston.username}`);
    }
  }

  await myDataSource.destroy();
  console.log("\n🎉 ==========================================");
  console.log("   SEEDER COMPLETADO CON ÉXITO EN SUPABASE");
  console.log("==========================================\n");
}

runSeed().catch((error) => {
  console.error("❌ Error ejecutando seeder:", error);
  process.exit(1);
});
