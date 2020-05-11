import { } from 'protobufjs';

export interface ProtoFile {
  proto: File;
  fileName: string;
  services: ProtoServiceList;
}

export interface ProtoServiceList {
  [key: string]: ProtoService;
}

export interface ProtoService {
  proto: File;
  serviceName: string;
  methodsMocks: string;
  methodsName: string[];
}
