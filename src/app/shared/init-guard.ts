import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';

import { ZzaRepositoryService } from './zzarepository.service';

@Injectable()
export class InitGuard implements CanActivate, CanActivateChild {

  constructor(private _zzaRepository: ZzaRepositoryService){

  }
  
  canActivate() : Promise<boolean> {
    return this._zzaRepository.initialize();
  }

  canActivateChild() : Promise<boolean> {
    return this.canActivate();
  }
}