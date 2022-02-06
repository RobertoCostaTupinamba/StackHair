import { Notification, toaster } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

export const notification = (type, params) => {
  const message = (
    <Notification type={type} header={type} closable>
      {params.description}
    </Notification>
  );

  toaster.push(message, params);

  // <Notification type={type} header={params.title} closable>
  //   {params.description}
  // </Notification>;
};
