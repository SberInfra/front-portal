// Так же для проведения массовых операций администраторами групп была введена функция отключения КВР на промежуток до 1 часа
// Выключение КВР доступно только администраторам портала
// (например необходимо накатить определенное обновление на сотни/тысячи серверов и перед этим их надо выключить, чтобы таска спокойно прошла)

// Ниже таймер, показывает сколько осталось до включения КВР
import React, { FC, useState, useEffect } from 'react';
import moment from 'moment-timezone';

import { t } from 'utils/Translations';

interface IProps {
  timer: Date; // время включения КВР приходит с бека, по мск времени
  showSubTitle?: boolean;
}

export const Timer: FC<IProps> = ({ timer, showSubTitle }) => {
  const tick = () => {
    const newTime = moment(time, 'mm:ss')
      .subtract(1, 'second')
      .format('mm:ss');

    setTime(newTime);
  };

  const timeout: NodeJS.Timeout = setTimeout(tick, 1000);
  const turnOn = moment(timer);
  const current = moment().tz('Europe/Moscow');
  const left = moment(turnOn.diff(current)).format('mm:ss');

  const [time, setTime] = useState(left);

  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);

  if (time === '00:00') {
    clearTimeout(timeout);

    return null;
  }

  return (
    <div className="mt5">
      {time} {showSubTitle && t('subtitle', 'group.timer_modal')}
    </div>
  );
};
