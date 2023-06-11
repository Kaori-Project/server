import { Matches } from 'class-validator';

export class GetUsersParams {
  @Matches(/^\d{18}$/, {
    message: (ctx) => `'${ctx.value}' is not a discord user id.`,
  })
  userId: string;
}
