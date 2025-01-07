
# ShiftManagerApp

## About project

ShiftManagerApp is an application designed for potential business owners, allowing them to manage their departments, employees, work shift schedules, and work records. The system architecture is based on assumption that only selected users have access to system resources by logging into their accounts, which are created by the system administrator. Application is written in ASP.Net Core on backend side, and Angular on client side. Additionaly application uses technologies such as WebSocket for real-time notification functionality and SMTP server for email sending.

## Functionality

Users without account can:
- Register clock-in and clock-out times.

Regular users can:
- Get informations about departments, employees, work shifts, work records and other users.
- Confirm accounts via link sent to user's email
- Change or reset password to account via link sent to user's email

Managers can:
- Access same functionalities as regular users.
- Edit existing work shifts.
- Create new work shifts.

Admins can:
- Access same functionalities as managers.
- Create new departments, employees and users.
- Edit existing departments, employees, work shifts, work records and users.
- Assign and revoke manager roles.

## Demo

https://shiftmanager.pl/

- Demo manager
    - Login: demo01
    - Password: Demo1!@#
- Demo admin
    - Login: demoadmin
    - Password: zaq1@WSX

