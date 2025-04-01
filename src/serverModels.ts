
export enum CPU {
   X86 = "X86",
   Power = "Power",
   ARM = "ARM"
}

export const cpuOptions = Object.keys(CPU);

export type InputType = {
  cpu:CPU;
  memSize:number;
  needsGPU:boolean;
}

export enum ServerModel {
    TowerServer = "Tower Server",
    _4URackServer = "4U Rack Server",
    Mainframe = "Mainframe",
    HighDensityServer = "High Density Server"
}

export function isPowerOf2(n:number) {
    return n > 0 && (n & (n - 1)) === 0;
  }
  
export function  isMultipleOf1024(memSize: number) {
    return memSize % 1024 === 0;
};

export const getServerModelOptions = ({cpu, memSize, needsGPU}:InputType):ServerModel[]=>{
    if(!isMultipleOf1024(memSize) || !isPowerOf2(memSize) || memSize < 2048 || memSize>8388608 ){
        return []
    }

    if(needsGPU && memSize >= 524288 && cpu === CPU.ARM){
        return [ServerModel.HighDensityServer]
    }
   
    let ret:ServerModel[] = []
    if(cpu === CPU.Power) {
        ret.push(ServerModel.Mainframe)
    }

    ret.push(ServerModel.TowerServer)
    if(memSize >= 131072){
        ret.push(ServerModel._4URackServer)
    }
    
    return ret
}
