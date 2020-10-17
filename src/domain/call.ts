import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
    description: 'Get Call Token',
    name: 'CallToken'
})
export class CallToken {
  @ApiModelProperty({
      description: 'Token'
  })
  token: string;
}
