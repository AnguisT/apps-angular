/**
 * Created by Sergey Trizna on 15.03.2017.
 */
import * as $ from 'jquery';
import { Injectable } from '@angular/core';
import {
    ViewContainerRef,
    ComponentRef,
    ReflectiveInjector,
    ComponentFactoryResolver,
    Inject
} from '@angular/core';
import { ModalConfig } from '../modal.config';

export interface ModalProviderInterface {
    config: ModalConfig;
    compiledContentView: any;
    compFactoryResolver: ComponentFactoryResolver;
    defaultModals: Array<{name: string, ref: ViewContainerRef}>;
    build(config: ModalConfig, refs: {content: ViewContainerRef, modal: any}): any;
    setModal(name: string, ref: ViewContainerRef);
    getModal(name: string): ViewContainerRef;
    createComponent(containerRef: ViewContainerRef, type: any, data): ComponentRef<any>;
    getReferences();

}

@Injectable()
export class ModalProvider implements ModalProviderInterface {
    config: ModalConfig;
    compiledContentView: any;
    compFactoryResolver: ComponentFactoryResolver;
    defaultModals: Array<{name: string, ref: ViewContainerRef}> = [];
    constructor(_compFactoryResolver: ComponentFactoryResolver) {
        this.compFactoryResolver = _compFactoryResolver;
    }

    setModal(name: string, ref: ViewContainerRef) {
        this.defaultModals[name] = ref;
    }

    getModal(name: string): ViewContainerRef|any {
        let m = this.defaultModals[name];
        let mc = m.getContent();

        if (mc.onOk && mc.onOk.observers.length > 0) {
            $.each(mc.onOk.observers, (k, o) => {
                o.unsubscribe();
            });
        }
        if (mc.onCancel && mc.onCancel.observers.length > 0) {
            $.each(mc.onCancel.observers, (k, o) => {
                o.unsubscribe();
            });
        }

        return m;
    }

    /**
     * Destroy previously and reate component
     * @param config
     * @param refs
     */
    build(config: ModalConfig, refs: {content: ViewContainerRef, modal: any}): any {
        // Destroy the previously created component
        if (this.compiledContentView) {
            this.compiledContentView.destroy();
        }

        this.compiledContentView = this.createComponent(refs.content, config.options.content.view, {
            refs: refs,
            config: this.config,
        });
    }


    /**
     * Create component
     * @param containerRef
     * @param type
     * @returns {ComponentRef<T>}
     */
    createComponent(containerRef: ViewContainerRef, type: any, data): ComponentRef<any> {
        let factory = this.compFactoryResolver.resolveComponentFactory(type);

        let resolvedInputs = ReflectiveInjector.resolve([{provide: 'data', useValue: data}]);
        // containerRef is needed cause of that injector..
        let injector = ReflectiveInjector.fromResolvedProviders(
            resolvedInputs, containerRef.parentInjector
        );

        // create component without adding it directly to the DOM
        let comp = factory.create(injector);

        // insert component to container
        containerRef.insert(comp.hostView);
        // containerRef.element.nativeElement.appendChild(comp.hostView);

        return comp;
    }

    getReferences() {
        return this.config.moduleContext.getReferences();
    }
}
