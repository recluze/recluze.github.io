---
layout: post
title: Row-level Permissions in Django Admin
date: 2012-12-16 12:07:44.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Django
- python
- Tutorials
tags: []
meta:
  _wpas_done_all: '1'
  _publicize_pending: '1'
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
  _s2mail: 'yes'
  videourl: ''
  original_post_id: '828'
  _wp_old_slug: '828'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2012/12/16/row-level-permissions-in-django-admin/"
---
So you've [started working with Django](https://docs.djangoproject.com/en/dev/intro/tutorial01/) and you love the admin interface that you get for free with your models. You deploy half of your app with the admin interface and are about to release when you figure out that anyone who can modify a model can do anything with it. There is no concept of "ownership" of records!

Let me give you an example. Let's say we're creating a little MIS for the computer science department where each faculty member can put in his courses and record the course execution (what was done per lecture). That would be a nice application. (In fact, it's available [open source on github](http://recluze.github.com/fastnu-csd-audit) and that is what this tutorial is referring to.) However, the issue is that all instructors can access all the course records and there is no way of ensuring that an instructor can modify only the courses that s/he taught. This isn't easily possible because admin doesn't not have "row-level permissions".

<!--more-->

Of course, we can create them by sub-classing some of the Admin classes and modifying a couple of functions. Here's how:

Let's assume we have the following in our models:

[sourcecode lang="python"]  
class Instructor(models.Model):  
 name = models.CharField(max\_length=200)  
 # other stuff here

class Course(models.Model):  
 course\_code = models.CharField(max\_length=10, default='CS')  
 instructor = models.ForeignKey(Instructor)  
 course\_name = models.CharField(max\_length=200)  
 # other stuff here

class CourseOutline(models.Model):  
 course = models.OneToOneField(Course)  
 objectives = models.TextField(blank=True)  
 # other stuff  
[/sourcecode]

And in admin.py, we have the following:

[sourcecode lang="python"]  
class CourseAdmin(admin.ModelAdmin):  
 list\_display = ('course\_name', 'instructor')  
 # some other stuff

admin.site.register(Course, CourseAdmin)

class CourseOutlineAdmin(admin.ModelAdmin):  
 # nothing here of importance

admin.site.register(CourseOutline, CourseOutlineAdmin)  
[/sourcecode]

So, when you open the page for Course, you can see the instructors and when you open the CourseOutline, you can see the Courses. Pretty good but how do we add row-level permissions? We do this by overriding a couple of functions.

Here's the strategy I followed:

First, create a user account for each instructor. Then, take away these user's rights to modify Instructor objects. (You can keep stuff in Instructor Profile so that they can modify their information.)

Next, add a field to the Instructor model that binds it to a particular user. The model now becomes:

[sourcecode lang="python"]  
from django.contrib.auth.models import User  
...

class Instructor(models.Model):  
 name = models.CharField(max\_length=200)  
 owner = models.ForeignKey(User)  
 # other stuff here

[/sourcecode]

The other models can remain the same. We only need to modify their "querysets". Let's open up admin.py again and modify the \*Admins.

We override two functions to make CourseAdmin look like the following:

[sourcecode lang="python"]  
class CourseAdmin(admin.ModelAdmin):  
 # whatever was here

def queryset(self, request):  
 qs = super(CourseAdmin, self).queryset(request)  
 if request.user.is\_superuser:  
 return qs

# get instructor's "owner"  
 return qs.filter(instructor\_\_owner=request.user)

def formfield\_for\_foreignkey(self, db\_field, request, \*\*kwargs):  
 if db\_field.name == "instructor" and not request.user.is\_superuser:  
 kwargs["queryset"] = Instructor.objects.filter(owner=request.user)  
 return db\_field.formfield(\*\*kwargs)  
 return super(CourseAdmin, self).formfield\_for\_foreignkey(db\_field, request, \*\*kwargs)

admin.site.register(Course, CourseAdmin)  
[/sourcecode]

What's that? The first function basically modifies the queryset function and makes sure that if you're not a super user, you will see only those courses in the course list where `instructor__owner=request.user` i.e. your own courses.

The second function is required so that you can't add courses that belong to other instructors. It filters the foreign key dropdown box so that only `owner=request.user` objects are shown in the foreign key dropdown. That is, you only see yourself in that dropdown.

We can do the same thing for CourseOutline. That is here:

[sourcecode lang="python"]  
class CourseOutlineAdmin(admin.ModelAdmin):  
 # whatever was here

def queryset(self, request):  
 qs = super(CourseOutlineAdmin, self).queryset(request)  
 if request.user.is\_superuser:  
 return qs

# get instructor's "owner"  
 return qs.filter(course\_\_instructor\_\_owner=request.user)

def formfield\_for\_foreignkey(self, db\_field, request, \*\*kwargs):  
 if db\_field.name == "course" and not request.user.is\_superuser:  
 kwargs["queryset"] = Course.objects.filter(instructor\_\_owner=request.user)  
 return db\_field.formfield(\*\*kwargs)  
 return super(CourseAdmin, self).formfield\_for\_foreignkey(db\_field, request, \*\*kwargs)

[/sourcecode]

The only difference is that we're now going two levels up the foreign key ladder. That's all you need to have row-level permissions in admin. Questions?

