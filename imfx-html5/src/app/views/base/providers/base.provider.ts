/**
 * Created by Sergey Trizna on 08.01.2018.
 */
import {
    ApplicationRef,
    ComponentFactoryResolver, ComponentRef,
    EmbeddedViewRef,
    Inject,
    Injectable,
    Injector, Provider,
    ReflectiveInjector
} from "@angular/core";
@Injectable()

export class BaseProvider {
    private _outletComponent: any;
    get outletComponent(): any {
        return this._outletComponent
    }

    set outletComponent(comp: any) {
        this._outletComponent = comp;
    }

    constructor(@Inject(ComponentFactoryResolver) public compFactoryResolver: ComponentFactoryResolver,
                @Inject(ApplicationRef) public appRef: ApplicationRef,
                @Inject(Injector) public injector: Injector) {
    }

    buildComponent(comp: any, data: Object, element: HTMLElement|any, delay: boolean = false): ComponentRef<any> {
        if(!element){
            return;
        }
        let componentRef = this.createComponent(comp, [{provide: 'data', useValue: data}]);
        this.insertComponent(componentRef, element);

        return componentRef;
    }

    public insertComponent(componentRef, element) {
        this.appRef.attachView(componentRef.hostView);
        let domElem = (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;

        // debugger;
        if (element) {
            (<any>$(element)).html(domElem);
        } else {
            throw new Error('Element not found');
        }
    }

    public createComponent(comp, resolveData: Provider[]): ComponentRef<any> {
        let factory = this.compFactoryResolver.resolveComponentFactory(comp);
        let resolvedInputs = ReflectiveInjector.resolve(resolveData);

        let injector = ReflectiveInjector.fromResolvedProviders(
            resolvedInputs
        );
        return factory.create(injector);
    }

}
