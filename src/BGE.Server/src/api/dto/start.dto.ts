export class StartDto {
  readonly userId: string;
  readonly gameToken: string;
  readonly rows?: number;
  readonly cols?: number;
}
