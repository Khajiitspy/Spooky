# Manipulating data:

How to manipulate categories using the console of this python web program.

## Enter shell (you need to enter the shell to manipulate the data)
`python manage.py shell`

## Import the model (category)

### Replace "DishCategory" with the name of the model you want to manipulate
`from menu.models import DishCategory`
## Create the object (category)

### Creates a new object of that model. Inside the parenthesis, enter the values replace <Name> with what you want if you are creating categories.
`DishCategory.objects.create(name="<Name>")`

## Edit an object (category)

### Creating a variable that stores the object found from get (searches by mathing values).
`category = DishCategory.objects.get(name="<Name>")`

### Reassign/edit the values
`category.name = "<New Name>"`

### save/commit changes
`category.save()`

## Delete an object (category)
```
category = DishCategory.objects.get(name="Десерти")
category.delete()
```

## List all object (categories)
`DishCategory.objects.all()`
