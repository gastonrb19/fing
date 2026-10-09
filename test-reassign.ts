import { myDataSource } from './src/config/app-data-source.js';
import { InstallmentUserPaymentService } from './src/services/installmentUserPayment.js';
import { InstallmentUserPayment } from './src/models/InstallmentUserPayment.js';

async function run() {
  await myDataSource.initialize();
  const paymentService = new InstallmentUserPaymentService();
  const paymentRepo = myDataSource.getRepository(InstallmentUserPayment);

  // Buscar un pago cualquiera existente
  const payments = await paymentRepo.find({ relations: ["user"], take: 1 });
  
  if (payments.length > 0) {
      const payment = payments[0];
      console.log(`Pago actual asignado a ID: ${payment.user.id}`);
      
      // Intentar cambiar a ID 1
      const nuevoId = payment.user.id === 1 ? 2 : 1;
      console.log(`Intentando reasignar a ID: ${nuevoId}...`);
      
      const res = await paymentService.update(payment.idPayment, { userId: nuevoId });
      console.log(`Resultado devuelto por el servicio: ID ${res.user.id}`);
      
      // Verificar en base de datos si realmente cambió
      const updatedPayment = await paymentRepo.findOne({ where: { idPayment: payment.idPayment }, relations: ["user"] });
      console.log(`Valor real en Base de Datos: ID ${updatedPayment.user.id}`);
  }

  await myDataSource.destroy();
}
run();
