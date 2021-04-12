// Ниже фрагмент кода, который "наполняет" каждую ВМ действиями в таблице, внутри if проверки на тип ВМ, проверки роли текущего пользователя, текущими правилами и тд.
// Некоторые из проверок затрагивают роли пользователя/разрешения/тип вм/статус вм и тд.
  @action.bound
  getActions(vm: IVm) {
    const actions: string[] = [];

    if (this.canChangeServerStatus(vm)) {
      actions.push('change_server_status');
    }

    if (this.canPowerOnForce(vm)) {
      actions.push('power_on_force');
    }

    if (this.canMoveVm(vm)) {
      actions.push('move_vm');
    }

    if (this.canRebuildVm(vm)) {
      actions.push('rebuild');
    }

    if (this.canCancelPendingStatus(vm)) {
      actions.push('cancel_pending_status');
    }

    if (this.canApprovePendingStatus(vm)) {
      const action = this.getActionFromPendingStatus(vm);
      actions.push(action);
    }

    if (this.canCopyUUID(vm)) {
      actions.push('copy_uuid');
    }

    if (this.canRemoveVm(vm)) {
      const action = this.getRemoveVmAction(vm);
      actions.push(action);
    }

    if (this.canPowerOff(vm)) {
      actions.push('power_off');
    }

    if (this.canPowerOn(vm)) {
      actions.push('power_on');
    }

    if (this.canSoftReboot(vm)) {
      actions.push('soft_reboot');
    }

    if (this.canHardReboot(vm)) {
      actions.push('hard_reboot');
    }

    return actions;
  }

// определяем доступное действие, по статусу ВМ
  @action.bound
  getActionFromPendingStatus = (vm: IVm): string => {
    switch (vm.state) {
      case 'pending_deletion':
        if (isCluster(vm)) {
          return 'remove_cluster';
        }

        return 'remove_vm';

      case 'pending_rebuild':
      case 'pending_move_vm':
      case 'pending_soft_reboot':
      case 'pending_hard_reboot':
        return vm.state.split('pending_')[1];

      case 'pending_power_off':
      case 'pending_power_on':
        return `confirm_${vm.state.split('pending_')[1]}`;

      case 'pending_resize':
        return 'resize_approve';

      default:
        return '';
    }
  };

// Т.е. при включенном КВР пользователь выбрал действие удалить ВМ (remove_vm), после вызова функции статус ВМ меняется на pending_deletion,
// в canRemoveVm определяется может ли пользователь подтвердить это действие (инициатор не может).
// Другой участник группы видит только действие "Удалить", а так же видит что статус машины "Подтверждение удаления""


// После того как пользователь выбрал действие оно попадает в обработчик, который дальше уже вызывает API с нужными параметрами
  @action.bound
  async handleVmAction({ action, vms, event, needConfirm, message = '' }: IVmAction) {
    this.clearSelectedRows();

    if (event) {
      event.preventDefault();
    }

    if (needConfirm) {
      return this.confirmVmAction({ vms: _vms, action, message });
    }

    updateOrder({...});
    this.actionHandler?.();
  }

