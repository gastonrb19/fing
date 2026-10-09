import { myDataSource } from './src/config/app-data-source.js';
import { InstallmentUserPaymentService } from './src/services/installmentUserPayment.js';
import { InstallmentUserPayment } from './src/models/InstallmentUserPayment.js';

async function run() {
  await myDataSource.initialize();
  const paymentService = new InstallmentUserPaymentService();
  const paymentRepo = myDataSource.getRepository(InstallmentUserPayment);

  const payments = await paymentRepo.find({ relations: ["user"], take: 1 });
  
  if (payments.length > 0) {
      const payment = payments[0];
      const viejoId = payment.user?.id || payment.userId;
      const nuevoId = viejoId === 1 ? 2 : 1;
      
      console.log(`Reasignando ID ${viejoId} -> ${nuevoId}`);
      await paymentService.update(payment.idPayment, { userId: nuevoId });
  }

  await myDataSource.destroy();
}
run();
