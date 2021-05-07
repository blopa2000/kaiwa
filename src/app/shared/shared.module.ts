import { NgModule } from '@angular/core';
import { ChainAdjustmentPipe } from './pipes/chain-adjustment.pipe';

@NgModule({
  declarations: [ChainAdjustmentPipe],
  imports: [],
  exports: [ChainAdjustmentPipe],
})
export class SharedModule {}
