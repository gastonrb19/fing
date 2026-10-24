import "reflect-metadata";
import { myDataSource } from "../src/config/app-data-source.js";

async function testSupabaseConnection() {
  console.log("\n📡 --- Verificando Conexión a Base de Datos (Supabase) ---");

  const host = process.env.DB_HOST || (process.env.DATABASE_URL ? "DATABASE_URL configurado" : "localhost");
  const user = process.env.DB_USER || "postgres";
  const db = process.env.DB_NAME || "postgres";
  const port = process.env.DB_PORT || "5432";
  const ssl = (myDataSource.options as any).ssl ? "Habilitado (SSL)" : "Deshabilitado";

  console.log(`🌐 Host: ${host}`);
  console.log(`🔌 Puerto: ${port}`);
  console.log(`👤 Usuario: ${user}`);
  console.log(`📦 Base de Datos: ${db}`);
  console.log(`🔒 SSL: ${ssl}\n`);

  try {
    console.log("⏳ Conectando con TypeORM a Supabase...");
    await myDataSource.initialize();
    console.log("✅ ¡Conexión establecida exitosamente con la base de datos!\n");

    const rawQueryResult = await myDataSource.query(
      "SELECT current_database() as database, current_user as user, version() as version;"
    );
    console.log("📊 Datos de la sesión PostgreSQL:");
    console.log(`   - Base de datos actual: ${rawQueryResult[0]?.database}`);
    console.log(`   - Usuario conectado: ${rawQueryResult[0]?.user}`);
    console.log(`   - Versión PostgreSQL: ${rawQueryResult[0]?.version?.split(" ")[0]} ${rawQueryResult[0]?.version?.split(" ")[1]}`);

    const tablesResult = await myDataSource.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    );
    console.log(`\n📋 Tablas en el esquema público (${tablesResult.length} encontradas):`);
    if (tablesResult.length === 0) {
      console.log("   (Ninguna tabla aún. TypeORM creará las tablas automáticamente al iniciar el servidor)");
    } else {
      tablesResult.forEach((row: any) => console.log(`   ✓ ${row.table_name}`));
    }

    await myDataSource.destroy();
    console.log("\n🎉 ¡Prueba finalizada con éxito! Tu localhost está listo para comunicarse con Supabase.\n");
    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Error al conectar a la base de datos:");
    console.error(error.message || error);

    if (error.message?.includes("password authentication failed")) {
      console.log("\n💡 Diagnóstico: La contraseña ingresada no es correcta para el usuario en Supabase.");
    } else if (error.message?.includes("ENOTFOUND") || error.message?.includes("EAI_AGAIN")) {
      console.log("\n💡 Diagnóstico: No se pudo resolver el nombre del Host. Revisa que el DB_HOST sea el correcto.");
    } else if (error.message?.includes("SSL")) {
      console.log("\n💡 Diagnóstico: Problema con la negociación SSL requerida por Supabase.");
    }

    process.exit(1);
  }
}

testSupabaseConnection();
