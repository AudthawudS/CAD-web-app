interface ICEvent<T>
{
    on(handler: { (data?: T): void });
    off(handler: { (data?: T): void });
}

class CEvent<T> implements ICEvent<T> {
    private handlers: { (data?: T): void; }[] = [];

    public on(handler: { (data?: T): void })
    {
        this.handlers.push(handler);
    }

    public off(handler: { (data?: T): void })
    {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public fire(data?: T)
    {
        if (this.handlers)
        {
            this.handlers.slice(0).forEach(h => h(data));
        }
    }
}